package com.traveloop.model.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * AI-generated itinerary suggestion returned to the frontend.
 * Structured for direct rendering in the Itinerary Builder UI.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItinerarySuggestion {

    private String tripName;
    private String destination;
    private String summary;
    private Integer totalDays;
    private BigDecimal estimatedTotalCost;

    private List<DaySuggestion> days;
    private List<PackingSuggestion> packingList;
    private List<String> travelTips;
    private BudgetBreakdown budgetBreakdown;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DaySuggestion {
        private Integer dayNumber;
        private String theme;
        private List<ActivitySuggestion> activities;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivitySuggestion {
        private String name;
        private String description;
        private String timeSlot;
        private String category;
        private BigDecimal estimatedCost;
        private String location;
        private Integer durationMinutes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PackingSuggestion {
        private String category;
        private List<String> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BudgetBreakdown {
        private BigDecimal accommodation;
        private BigDecimal food;
        private BigDecimal transport;
        private BigDecimal activities;
        private BigDecimal shopping;
        private BigDecimal miscellaneous;
    }
}
