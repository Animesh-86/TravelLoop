package com.traveloop.service.interfaces;

import com.traveloop.model.dto.request.ItineraryRequest;
import com.traveloop.model.dto.response.ItinerarySuggestion;

import java.util.UUID;

/**
 * AI-powered itinerary generation service contract.
 */
public interface SmartPlannerService {

    /**
     * Generate a complete itinerary suggestion from a user request.
     * Supports both free-text prompts and structured inputs.
     */
    ItinerarySuggestion generateItinerary(ItineraryRequest request);

    /**
     * Generate an itinerary and automatically apply it to an existing trip.
     * Creates TripStops, TripActivities, and Budget entries.
     */
    ItinerarySuggestion generateAndApplyToTrip(UUID tripId, UUID userId, ItineraryRequest request);

    /**
     * Regenerate the itinerary for an existing trip (user can refine).
     */
    ItinerarySuggestion regenerateItinerary(UUID tripId, UUID userId, String refinementPrompt);
}
