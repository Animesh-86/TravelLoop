package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class BudgetSummaryResponse {

    private BigDecimal totalEstimated;
    private BigDecimal totalActual;
    private BigDecimal totalVariance;
    private BigDecimal usagePercentage; // (actual / estimated) * 100
    private List<CategoryBreakdown> categories;

    @Data @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class CategoryBreakdown {
        private String category;
        private BigDecimal estimated;
        private BigDecimal actual;
        private BigDecimal variance;
    }
}
