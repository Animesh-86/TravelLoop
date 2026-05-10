package com.traveloop.controller;

import com.traveloop.model.dto.request.BudgetRequest;
import com.traveloop.model.dto.response.BudgetResponse;
import com.traveloop.model.dto.response.BudgetSummaryResponse;
import com.traveloop.service.interfaces.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips/{tripId}/budgets")
@Tag(name = "Budgets", description = "Budget tracking per trip — estimated vs actual")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @Operation(summary = "Add a budget item to a trip")
    public ResponseEntity<BudgetResponse> addBudget(
            Authentication auth,
            @PathVariable UUID tripId,
            @Valid @RequestBody BudgetRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.addBudgetItem(tripId, userId, request));
    }

    @GetMapping
    @Operation(summary = "Get all budget items for a trip")
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            Authentication auth,
            @PathVariable UUID tripId) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(budgetService.getBudgetItems(tripId, userId));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get budget summary with category breakdowns")
    public ResponseEntity<BudgetSummaryResponse> getBudgetSummary(
            Authentication auth,
            @PathVariable UUID tripId) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(budgetService.getBudgetSummary(tripId, userId));
    }

    @PutMapping("/{budgetId}")
    @Operation(summary = "Update a budget item")
    public ResponseEntity<BudgetResponse> updateBudget(
            Authentication auth,
            @PathVariable UUID tripId,
            @PathVariable UUID budgetId,
            @Valid @RequestBody BudgetRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(budgetService.updateBudgetItem(tripId, budgetId, userId, request));
    }

    @DeleteMapping("/{budgetId}")
    @Operation(summary = "Delete a budget item")
    public ResponseEntity<Void> deleteBudget(
            Authentication auth,
            @PathVariable UUID tripId,
            @PathVariable UUID budgetId) {
        UUID userId = (UUID) auth.getPrincipal();
        budgetService.deleteBudgetItem(tripId, budgetId, userId);
        return ResponseEntity.noContent().build();
    }
}
