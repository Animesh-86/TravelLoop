package com.traveloop.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.traveloop.exception.ResourceNotFoundException;
import com.traveloop.model.dto.request.ItineraryRequest;
import com.traveloop.model.dto.response.ItinerarySuggestion;
import com.traveloop.model.entity.*;
import com.traveloop.repository.*;
import com.traveloop.service.interfaces.SmartPlannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Spring AI-powered itinerary generation service.
 * Uses Gemini via the OpenAI-compatible ChatClient to produce
 * structured travel plans with day-wise activities, packing lists,
 * and budget breakdowns.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SmartPlannerServiceImpl implements SmartPlannerService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    private final TripRepository tripRepository;
    private final TripStopRepository tripStopRepository;
    private final CityRepository cityRepository;
    private final BudgetRepository budgetRepository;

    /* ──────────────────────────────────────────────────
     *  1.  Standalone generation (preview / no trip)
     * ────────────────────────────────────────────────── */
    @Override
    public ItinerarySuggestion generateItinerary(ItineraryRequest request) {
        String prompt = buildPrompt(request);
        log.debug("AI prompt built — length={}", prompt.length());

        String rawJson = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return parseResponse(rawJson);
    }

    /* ──────────────────────────────────────────────────
     *  2.  Generate + apply to an existing trip
     * ────────────────────────────────────────────────── */
    @Override
    @Transactional
    public ItinerarySuggestion generateAndApplyToTrip(UUID tripId, UUID userId,
                                                       ItineraryRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));

        if (!trip.getUser().getUserId().equals(userId)) {
            throw new IllegalStateException("Only the trip owner can generate an AI itinerary");
        }

        // Enrich the request with trip context
        if (request.getDestinationCity() == null && !trip.getStops().isEmpty()) {
            TripStop firstStop = trip.getStops().get(0);
            if (firstStop.getCity() != null) {
                request.setDestinationCity(firstStop.getCity().getCityName());
                request.setCountry(firstStop.getCity().getCountry());
            }
        }
        if (request.getNumberOfDays() == null && trip.getStartDate() != null && trip.getEndDate() != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;
            request.setNumberOfDays((int) days);
        }
        if (request.getBudget() == null && trip.getTotalBudget() != null) {
            request.setBudget(trip.getTotalBudget());
        }

        ItinerarySuggestion suggestion = generateItinerary(request);

        // Apply suggestion to the trip
        applyToTrip(trip, suggestion);

        log.info("AI itinerary applied to trip={} with {} days",
                tripId, suggestion.getDays() != null ? suggestion.getDays().size() : 0);

        return suggestion;
    }

    /* ──────────────────────────────────────────────────
     *  3.  Regenerate with refinement
     * ────────────────────────────────────────────────── */
    @Override
    @Transactional
    public ItinerarySuggestion regenerateItinerary(UUID tripId, UUID userId,
                                                    String refinementPrompt) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));

        if (!trip.getUser().getUserId().equals(userId)) {
            throw new IllegalStateException("Only the trip owner can regenerate the itinerary");
        }

        // Build a refinement-aware request
        ItineraryRequest request = ItineraryRequest.builder()
                .prompt(refinementPrompt)
                .numberOfDays(
                    trip.getStartDate() != null && trip.getEndDate() != null
                        ? (int) java.time.temporal.ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1
                        : 3
                )
                .budget(trip.getTotalBudget())
                .build();

        // Pull city from existing stops
        if (!trip.getStops().isEmpty() && trip.getStops().get(0).getCity() != null) {
            request.setDestinationCity(trip.getStops().get(0).getCity().getCityName());
            request.setCountry(trip.getStops().get(0).getCity().getCountry());
        }

        ItinerarySuggestion suggestion = generateItinerary(request);

        // Clear old stops and budgets, then re-apply
        tripStopRepository.deleteByTripTripId(tripId);
        budgetRepository.deleteByTripTripId(tripId);
        applyToTrip(trip, suggestion);

        return suggestion;
    }

    /* ═══════════════════════════════════════════════════
     *  PRIVATE HELPERS
     * ═══════════════════════════════════════════════════ */

    /**
     * Builds a structured prompt that guides Gemini to return valid JSON.
     */
    private String buildPrompt(ItineraryRequest request) {
        StringBuilder sb = new StringBuilder();

        // If user provided a free-text prompt, lead with it
        if (request.getPrompt() != null && !request.getPrompt().isBlank()) {
            sb.append("User request: ").append(request.getPrompt()).append("\n\n");
        }

        sb.append("Generate a detailed travel itinerary with the following parameters:\n");

        if (request.getDestinationCity() != null) {
            sb.append("- Destination: ").append(request.getDestinationCity());
            if (request.getCountry() != null) {
                sb.append(", ").append(request.getCountry());
            }
            sb.append("\n");
        }
        if (request.getNumberOfDays() != null) {
            sb.append("- Duration: ").append(request.getNumberOfDays()).append(" days\n");
        }
        if (request.getBudget() != null) {
            sb.append("- Total budget: $").append(request.getBudget()).append(" USD\n");
        }
        if (request.getTravelers() != null && request.getTravelers() > 1) {
            sb.append("- Number of travelers: ").append(request.getTravelers()).append("\n");
        }
        if (request.getInterests() != null && !request.getInterests().isEmpty()) {
            sb.append("- Interests: ").append(String.join(", ", request.getInterests())).append("\n");
        }
        if (request.getSpecialNotes() != null && !request.getSpecialNotes().isBlank()) {
            sb.append("- Special notes: ").append(request.getSpecialNotes()).append("\n");
        }

        sb.append("""
                
                Respond with a JSON object matching this exact schema:
                {
                  "tripName": "string",
                  "destination": "string",
                  "summary": "string (2-3 sentence overview)",
                  "totalDays": number,
                  "estimatedTotalCost": number,
                  "days": [
                    {
                      "dayNumber": number,
                      "theme": "string (e.g., 'Art & Culture Day')",
                      "activities": [
                        {
                          "name": "string",
                          "description": "string (1-2 sentences)",
                          "timeSlot": "string (e.g., '09:00 - 11:30')",
                          "category": "string (sightseeing|food|adventure|culture|shopping|transport|relaxation)",
                          "estimatedCost": number,
                          "location": "string (specific address or area)",
                          "durationMinutes": number
                        }
                      ]
                    }
                  ],
                  "packingList": [
                    {
                      "category": "string (e.g., 'Clothing', 'Electronics', 'Documents')",
                      "items": ["string"]
                    }
                  ],
                  "travelTips": ["string"],
                  "budgetBreakdown": {
                    "accommodation": number,
                    "food": number,
                    "transport": number,
                    "activities": number,
                    "shopping": number,
                    "miscellaneous": number
                  }
                }
                
                Include 3-5 activities per day.
                Make time slots realistic and sequential.
                Ensure budget breakdown sums to approximately the estimatedTotalCost.
                """);

        return sb.toString();
    }

    /**
     * Parse the raw JSON response from Gemini into our DTO.
     */
    private ItinerarySuggestion parseResponse(String rawJson) {
        try {
            // Strip potential markdown code fences
            String cleaned = rawJson;
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            return objectMapper.readValue(cleaned, ItinerarySuggestion.class);
        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", e.getMessage());
            log.debug("Raw AI response: {}", rawJson);

            // Return a minimal fallback so the frontend doesn't break
            return ItinerarySuggestion.builder()
                    .tripName("Generated Itinerary")
                    .summary("AI generated a response but it could not be parsed. " +
                             "Please try again or refine your prompt.")
                    .totalDays(0)
                    .build();
        }
    }

    /**
     * Materialize AI suggestions into real Trip entities
     * (TripStops, Budgets) and persist them.
     */
    private void applyToTrip(Trip trip, ItinerarySuggestion suggestion) {
        if (suggestion.getDays() == null || suggestion.getDays().isEmpty()) {
            return;
        }

        LocalDate baseDate = trip.getStartDate() != null
                ? trip.getStartDate()
                : LocalDate.now();

        // Create TripStops for each day
        for (ItinerarySuggestion.DaySuggestion day : suggestion.getDays()) {
            LocalDate dayDate = baseDate.plusDays(day.getDayNumber() - 1);

            TripStop stop = TripStop.builder()
                    .trip(trip)
                    .arrivalDate(dayDate)
                    .departureDate(dayDate)
                    .stopOrder(day.getDayNumber())
                    .notes("Day " + day.getDayNumber() + ": " + day.getTheme())
                    .build();

            // Try to link to an existing city
            if (suggestion.getDestination() != null) {
                cityRepository.findFirstByCityNameContainingIgnoreCase(suggestion.getDestination())
                        .ifPresent(stop::setCity);
            }

            tripStopRepository.save(stop);
        }

        // Create budget entries from the breakdown
        if (suggestion.getBudgetBreakdown() != null) {
            ItinerarySuggestion.BudgetBreakdown bb = suggestion.getBudgetBreakdown();
            createBudgetEntry(trip, "accommodation", bb.getAccommodation());
            createBudgetEntry(trip, "food", bb.getFood());
            createBudgetEntry(trip, "transport", bb.getTransport());
            createBudgetEntry(trip, "activities", bb.getActivities());
            createBudgetEntry(trip, "shopping", bb.getShopping());
            createBudgetEntry(trip, "miscellaneous", bb.getMiscellaneous());
        }

        // Update trip total budget
        if (suggestion.getEstimatedTotalCost() != null) {
            trip.setTotalBudget(suggestion.getEstimatedTotalCost());
            tripRepository.save(trip);
        }
    }

    private void createBudgetEntry(Trip trip, String category, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        Budget budget = Budget.builder()
                .trip(trip)
                .category(category)
                .estimatedAmount(amount)
                .actualAmount(BigDecimal.ZERO)
                .build();
        budgetRepository.save(budget);
    }
}
