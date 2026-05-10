package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TripStopResponse {

    private UUID stopId;
    private CityResponse city;
    private LocalDate arrivalDate;
    private LocalDate departureDate;
    private Integer stopOrder;
    private String notes;
    private List<TripActivityResponse> activities;
}
