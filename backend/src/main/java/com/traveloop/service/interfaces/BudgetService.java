package com.traveloop.service.interfaces;

import com.traveloop.model.dto.request.BudgetRequest;
import com.traveloop.model.dto.response.BudgetResponse;
import com.traveloop.model.dto.response.BudgetSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface BudgetService {

    BudgetResponse addBudgetItem(UUID tripId, UUID userId, BudgetRequest request);

    List<BudgetResponse> getBudgetItems(UUID tripId, UUID userId);

    BudgetSummaryResponse getBudgetSummary(UUID tripId, UUID userId);

    BudgetResponse updateBudgetItem(UUID tripId, UUID budgetId, UUID userId, BudgetRequest request);

    void deleteBudgetItem(UUID tripId, UUID budgetId, UUID userId);
}
