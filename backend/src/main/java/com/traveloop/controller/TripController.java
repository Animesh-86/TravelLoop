package com.traveloop.controller;

import com.traveloop.model.dto.request.TripRequest;
import com.traveloop.model.dto.response.TripResponse;
import com.traveloop.service.interfaces.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@Tag(name = "Trips", description = "Trip CRUD, sharing, and collaboration")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @Operation(summary = "Create a new trip")
    public ResponseEntity<TripResponse> createTrip(
            Authentication auth,
            @Valid @RequestBody TripRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.createTrip(userId, request));
    }

    @GetMapping("/{tripId}")
    @Operation(summary = "Get trip by ID")
    public ResponseEntity<TripResponse> getTrip(
            Authentication auth,
            @PathVariable UUID tripId) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(tripService.getTripById(tripId, userId));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's trips")
    public ResponseEntity<List<TripResponse>> getMyTrips(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(tripService.getUserTrips(userId));
    }

    @GetMapping("/shared")
    @Operation(summary = "Get trips shared with current user")
    public ResponseEntity<List<TripResponse>> getSharedTrips(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(tripService.getSharedTrips(userId));
    }

    @GetMapping("/public")
    @Operation(summary = "Get all public trips")
    public ResponseEntity<List<TripResponse>> getPublicTrips() {
        return ResponseEntity.ok(tripService.getPublicTrips());
    }

    @GetMapping("/share/{shareToken}")
    @Operation(summary = "Get trip by share token (public link)")
    public ResponseEntity<TripResponse> getTripByShareToken(@PathVariable String shareToken) {
        return ResponseEntity.ok(tripService.getTripByShareToken(shareToken));
    }

    @PutMapping("/{tripId}")
    @Operation(summary = "Update a trip")
    public ResponseEntity<TripResponse> updateTrip(
            Authentication auth,
            @PathVariable UUID tripId,
            @Valid @RequestBody TripRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(tripService.updateTrip(tripId, userId, request));
    }

    @PatchMapping("/{tripId}/status")
    @Operation(summary = "Update trip status (upcoming, active, completed)")
    public ResponseEntity<TripResponse> updateStatus(
            Authentication auth,
            @PathVariable UUID tripId,
            @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(tripService.updateTripStatus(tripId, userId, body.get("status")));
    }

    @PostMapping("/{tripId}/share")
    @Operation(summary = "Generate a shareable link for a trip")
    public ResponseEntity<Map<String, String>> generateShareLink(
            Authentication auth,
            @PathVariable UUID tripId) {
        UUID userId = (UUID) auth.getPrincipal();
        String token = tripService.generateShareToken(tripId, userId);
        return ResponseEntity.ok(Map.of("shareToken", token));
    }

    @PostMapping("/{tripId}/collaborators")
    @Operation(summary = "Add a collaborator by email")
    public ResponseEntity<Map<String, String>> addCollaborator(
            Authentication auth,
            @PathVariable UUID tripId,
            @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        tripService.addCollaborator(tripId, userId, body.get("email"), body.get("role"));
        return ResponseEntity.ok(Map.of("message", "Collaborator added successfully"));
    }

    @DeleteMapping("/{tripId}/collaborators/{collaboratorId}")
    @Operation(summary = "Remove a collaborator")
    public ResponseEntity<Void> removeCollaborator(
            Authentication auth,
            @PathVariable UUID tripId,
            @PathVariable UUID collaboratorId) {
        UUID userId = (UUID) auth.getPrincipal();
        tripService.removeCollaborator(tripId, userId, collaboratorId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{tripId}")
    @Operation(summary = "Delete a trip")
    public ResponseEntity<Void> deleteTrip(
            Authentication auth,
            @PathVariable UUID tripId) {
        UUID userId = (UUID) auth.getPrincipal();
        tripService.deleteTrip(tripId, userId);
        return ResponseEntity.noContent().build();
    }
}
