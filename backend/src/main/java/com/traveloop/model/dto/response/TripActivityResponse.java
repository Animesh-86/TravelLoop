package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class TripActivityResponse {

    private UUID tripActivityId;
    private UUID activityId;
    private String activityName;
    private String category;
    private String customName;
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;
    private String status;
    private String notes;
    private Integer durationMinutes;
}
