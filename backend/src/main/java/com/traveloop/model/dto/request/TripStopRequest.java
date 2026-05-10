package com.traveloop.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TripStopRequest {

    @NotNull(message = "City ID is required")
    private UUID cityId;

    @NotNull(message = "Arrival date is required")
    private LocalDate arrivalDate;

    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;

    @NotNull(message = "Stop order is required")
    private Integer stopOrder;

    private String notes;
}
