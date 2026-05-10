package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TripResponse {

    private UUID tripId;
    private String tripName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String coverPhotoUrl;
    private String status;
    private Boolean isPublic;
    private String shareToken;
    private BigDecimal totalBudget;
    private UserResponse owner;
    private List<TripStopResponse> stops;
    private int collaboratorCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
