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
    private final PackingItemRepository packingItemRepository;

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

    @Override
    @Transactional
    public String chatWithGenie(UUID tripId, UUID userId, String message) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Only owner can chat about trip details");
        }

        String destination = trip.getStops().isEmpty() || trip.getStops().get(0).getCity() == null 
                ? trip.getTripName() 
                : trip.getStops().get(0).getCity().getCityName();

        // ── Enhanced Context: Itinerary ──
        StringBuilder itineraryContext = new StringBuilder("\nItinerary Stops:\n");
        trip.getStops().forEach(stop -> {
            itineraryContext.append(String.format("- %s (%s to %s): %s\n", 
                stop.getCity() != null ? stop.getCity().getCityName() : "Unknown",
                stop.getArrivalDate(), stop.getDepartureDate(),
                stop.getNotes() != null ? stop.getNotes() : "No notes"));
        });

        // ── Enhanced Context: Packing List ──
        List<com.traveloop.model.entity.PackingItem> packingItems = packingItemRepository.findByTripTripIdOrderByCategoryAscItemNameAsc(tripId);
        StringBuilder packingContext = new StringBuilder("\nPacking List:\n");
        packingItems.forEach(item -> {
            packingContext.append(String.format("- [%s] %s (%s)\n", 
                item.getIsPacked() ? "x" : " ", item.getItemName(), item.getCategory()));
        });

        String context = String.format("Current Trip: %s\nDestination: %s\nDates: %s to %s\nTotal Budget: %s\n" +
                        "Description: %s\n%s%s",
                trip.getTripName(), destination, trip.getStartDate(), trip.getEndDate(),
                trip.getTotalBudget(), trip.getDescription(), 
                itineraryContext.toString(), packingContext.toString());

        String fullPrompt = "You are TravelLoop Genie, an AI travel assistant. " +
                "The user is planning the following trip:\n" + context + "\n\n" +
                "Instructions:\n" +
                "1. If the user asks for a summary, provide a concise, high-level overview of their itinerary and readiness (packing progress).\n" +
                "2. If the user asks about a city, provide interesting facts, weather insights, or travel tips for that location.\n" +
                "3. Be helpful, friendly, and concise. Provide actionable advice.\n\n" +
                "The user says: " + message;

        return chatClient.prompt().user(fullPrompt).call().content();
    }

    @Override
    public String generalChat(String message) {
        String faqContext = "Platform: TravelLoop (Smart Travel Planning)\n" +
                "Features: AI Itinerary Generation, Budget Tracking, Collaborative Planning, Packing Lists, Community Sharing.\n" +
                "FAQs:\n" +
                "- How to create a trip? Go to Dashboard and click 'Create Trip'.\n" +
                "- Is it free? Yes, the basic version is free for all travelers.\n" +
                "- How does AI planning work? We use Gemini AI to analyze your preferences and generate a structured plan.\n" +
                "- Can I invite friends? Yes, use the 'Collaborators' section in the trip builder.\n" +
                "- How to track expenses? Use the '+' button in the Budget section of your trip.\n" +
                "- How to see Indian cities? We prioritize them on the dashboard automatically!\n";

        String fullPrompt = "You are TravelLoop Genie, the helpful AI assistant for the TravelLoop platform. " +
                "Context about the website:\n" + faqContext + "\n\n" +
                "Instructions:\n" +
                "1. Answer user questions about the website, features, and general travel advice.\n" +
                "2. Be friendly, concise, and helpful.\n" +
                "3. If they ask about a specific trip, guide them to open that trip first.\n\n" +
                "User says: " + message;

        return chatClient.prompt().user(fullPrompt).call().content();
    }
}
