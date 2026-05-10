package com.traveloop.service.interfaces;

import com.traveloop.model.dto.request.TripRequest;
import com.traveloop.model.dto.response.TripResponse;

import java.util.List;
import java.util.UUID;

public interface TripService {

    TripResponse createTrip(UUID userId, TripRequest request);

    TripResponse getTripById(UUID tripId, UUID userId);

    TripResponse getTripByShareToken(String shareToken);

    List<TripResponse> getUserTrips(UUID userId);

    List<TripResponse> getSharedTrips(UUID userId);

    List<TripResponse> getPublicTrips();

    TripResponse updateTrip(UUID tripId, UUID userId, TripRequest request);

    TripResponse updateTripStatus(UUID tripId, UUID userId, String status);

    String generateShareToken(UUID tripId, UUID userId);

    void deleteTrip(UUID tripId, UUID userId);

    void addCollaborator(UUID tripId, UUID ownerId, String collaboratorEmail, String role);

    void removeCollaborator(UUID tripId, UUID ownerId, UUID collaboratorId);
}
