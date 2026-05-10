package com.traveloop.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class BudgetRequest {

    @NotBlank(message = "Category is required")
    @Size(max = 50)
    private String category;

    @NotNull(message = "Estimated amount is required")
    private BigDecimal estimatedAmount;

    private BigDecimal actualAmount;
}
