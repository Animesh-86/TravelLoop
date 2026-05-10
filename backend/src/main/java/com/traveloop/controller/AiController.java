package com.traveloop.controller;

import com.traveloop.model.dto.request.ItineraryRequest;
import com.traveloop.model.dto.response.ItinerarySuggestion;
import com.traveloop.model.entity.User;
import com.traveloop.repository.UserRepository;
import com.traveloop.service.interfaces.SmartPlannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST controller for AI-powered itinerary generation.
 * Endpoints follow RESTful nesting under /api/ai/*
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Recommendations", description = "Gemini-powered travel planning")
public class AiController {

    private final SmartPlannerService smartPlannerService;
    private final com.traveloop.service.interfaces.ReceiptScannerService receiptScannerService;
    private final UserRepository userRepository;

    /* ──────────────────────────────────────────────────
     *  POST /api/ai/generate
     *  Standalone itinerary generation (no trip needed)
     * ────────────────────────────────────────────────── */
    @PostMapping("/generate")
    @Operation(summary = "Generate AI itinerary (standalone)",
               description = "Generate a complete itinerary from a text prompt or structured inputs. " +
                             "Does not require an existing trip.")
    public ResponseEntity<ItinerarySuggestion> generateItinerary(
            @Valid @RequestBody ItineraryRequest request) {

        ItinerarySuggestion suggestion = smartPlannerService.generateItinerary(request);
        return ResponseEntity.ok(suggestion);
    }

    /* ──────────────────────────────────────────────────
     *  POST /api/ai/trips/{tripId}/generate
     *  Generate and apply to an existing trip
     * ────────────────────────────────────────────────── */
    @PostMapping("/trips/{tripId}/generate")
    @Operation(summary = "Generate AI itinerary for a trip",
               description = "Generate an itinerary and automatically apply it to the specified trip. " +
                             "Creates TripStops and Budget entries. Owner-only.")
    public ResponseEntity<ItinerarySuggestion> generateForTrip(
            @PathVariable UUID tripId,
            @Valid @RequestBody ItineraryRequest request,
            Authentication authentication) {

        UUID userId = extractUserId(authentication);
        ItinerarySuggestion suggestion = smartPlannerService
                .generateAndApplyToTrip(tripId, userId, request);
        return ResponseEntity.ok(suggestion);
    }

    /* ──────────────────────────────────────────────────
     *  POST /api/ai/trips/{tripId}/regenerate
     *  Refine/regenerate the itinerary with feedback
     * ────────────────────────────────────────────────── */
    @PostMapping("/trips/{tripId}/regenerate")
    @Operation(summary = "Regenerate AI itinerary with refinement",
               description = "Regenerate the itinerary for an existing trip using a refinement prompt. " +
                             "Clears previous AI-generated stops and budget entries.")
    public ResponseEntity<ItinerarySuggestion> regenerateItinerary(
            @PathVariable UUID tripId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        UUID userId = extractUserId(authentication);
        String refinementPrompt = body.getOrDefault("prompt",
                "Regenerate the itinerary with different activities");

        ItinerarySuggestion suggestion = smartPlannerService
                .regenerateItinerary(tripId, userId, refinementPrompt);
        return ResponseEntity.ok(suggestion);
    }

    /* ──────────────────────────────────────────────────
     *  POST /api/ai/receipt
     *  Scan receipt image and return JSON
     * ────────────────────────────────────────────────── */
    @PostMapping(value = "/receipt", consumes = "multipart/form-data")
    @Operation(summary = "Scan a receipt using Gemini Vision",
               description = "Upload a receipt image to extract items, prices, tax, and total.")
    public ResponseEntity<Map<String, Object>> scanReceipt(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        
        Map<String, Object> result = receiptScannerService.scanReceipt(file);
        return ResponseEntity.ok(result);
    }

    /* ──────────────────────────────────────────────────
     *  POST /api/ai/trips/{tripId}/chat
     *  Chat with TravelLoop Genie
     * ────────────────────────────────────────────────── */
    @PostMapping("/trips/{tripId}/chat")
    @Operation(summary = "Chat with TravelLoop Genie (Trip Context)",
               description = "Ask questions or get advice about a specific trip.")
    public ResponseEntity<Map<String, String>> chatWithGenie(
            @PathVariable UUID tripId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        
        UUID userId = extractUserId(authentication);
        String message = body.get("message");
        
        String response = smartPlannerService.chatWithGenie(tripId, userId, message);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @PostMapping("/chat")
    @Operation(summary = "General chat with TravelLoop Genie",
               description = "Ask general questions about the platform or travel tips.")
    public ResponseEntity<Map<String, String>> generalChat(
            @RequestBody Map<String, String> body) {
        
        String message = body.get("message");
        String response = smartPlannerService.generalChat(message);
        return ResponseEntity.ok(Map.of("response", response));
    }

    /* ─── Helper ─── */

    private UUID extractUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        return user.getUserId();
    }
}
