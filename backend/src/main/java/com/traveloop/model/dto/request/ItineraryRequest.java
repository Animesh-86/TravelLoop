package com.traveloop.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Input payload for AI itinerary generation.
 * Users can provide either structured fields OR a free-text prompt.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryRequest {

    /** Free-text prompt: "Plan 3 days in Paris under $1500" */
    private String prompt;

    /** Structured destination city name (used if prompt is empty) */
    private String destinationCity;

    /** Country of the destination */
    private String country;

    @Min(1)
    private Integer numberOfDays;

    /** Total budget in USD */
    private BigDecimal budget;

    /** Travel style preferences: e.g., "adventure", "cultural", "food", "budget", "luxury" */
    private List<String> interests;

    /** Number of travelers */
    @Builder.Default
    private Integer travelers = 1;

    /** Any constraints or special notes, e.g., "wheelchair accessible", "vegan food only" */
    private String specialNotes;
}
