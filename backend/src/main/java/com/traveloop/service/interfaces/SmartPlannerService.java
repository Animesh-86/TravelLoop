package com.traveloop.service.interfaces;

import com.traveloop.model.dto.request.ItineraryRequest;
import com.traveloop.model.dto.response.ItinerarySuggestion;

import java.util.UUID;

public interface SmartPlannerService {
    ItinerarySuggestion generateItinerary(ItineraryRequest request);
    ItinerarySuggestion generateAndApplyToTrip(UUID tripId, UUID userId, ItineraryRequest request);
    ItinerarySuggestion regenerateItinerary(UUID tripId, UUID userId, String refinementPrompt);
    String chatWithGenie(UUID tripId, UUID userId, String message);
    String generalChat(String message);
}
