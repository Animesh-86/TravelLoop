package com.traveloop.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TripRequest {

    @NotBlank(message = "Trip name is required")
    @Size(max = 200)
    private String tripName;

    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String country;
    private String city;

    private String coverPhotoUrl;
    private Boolean isPublic;
    private BigDecimal totalBudget;
    private List<TripStopRequest> stops;
}
