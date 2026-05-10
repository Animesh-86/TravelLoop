package com.traveloop.model.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

/**
 * Admin dashboard analytics response.
 * Provides platform-wide statistics for the admin panel.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {

    /* ── Overview KPIs ── */
    private long totalUsers;
    private long totalTrips;
    private long activeTrips;
    private long publicTrips;
    private long completedTrips;

    /* ── Growth ── */
    private List<MonthlyCount> userGrowth;
    private List<MonthlyCount> tripGrowth;

    /* ── Top destinations ── */
    private List<CityPopularity> topCities;

    /* ── Budget analytics ── */
    private Map<String, Double> avgBudgetByCategory;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyCount {
        private String month;
        private long count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CityPopularity {
        private String cityName;
        private String country;
        private int tripCount;
    }
}
