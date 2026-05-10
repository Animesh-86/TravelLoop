package com.traveloop.service.impl;

import com.traveloop.exception.ResourceNotFoundException;
import com.traveloop.model.dto.request.BudgetRequest;
import com.traveloop.model.dto.response.BudgetResponse;
import com.traveloop.model.dto.response.BudgetSummaryResponse;
import com.traveloop.model.entity.Budget;
import com.traveloop.model.entity.Trip;
import com.traveloop.repository.BudgetRepository;
import com.traveloop.repository.TripCollaboratorRepository;
import com.traveloop.repository.TripRepository;
import com.traveloop.service.interfaces.BudgetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private static final Logger log = LoggerFactory.getLogger(BudgetServiceImpl.class);

    private final BudgetRepository budgetRepository;
    private final TripRepository tripRepository;
    private final TripCollaboratorRepository collaboratorRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository,
                             TripRepository tripRepository,
                             TripCollaboratorRepository collaboratorRepository) {
        this.budgetRepository = budgetRepository;
        this.tripRepository = tripRepository;
        this.collaboratorRepository = collaboratorRepository;
    }

    @Override
    public BudgetResponse addBudgetItem(UUID tripId, UUID userId, BudgetRequest request) {
        Trip trip = verifyTripAccess(tripId, userId);

        Budget budget = Budget.builder()
                .trip(trip)
                .category(request.getCategory())
                .estimatedAmount(request.getEstimatedAmount())
                .actualAmount(request.getActualAmount() != null ? request.getActualAmount() : BigDecimal.ZERO)
                .build();

        Budget saved = budgetRepository.save(budget);
        log.info("Budget item added: {} for trip {}", request.getCategory(), tripId);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetItems(UUID tripId, UUID userId) {
        verifyTripAccess(tripId, userId);
        return budgetRepository.findByTripTripIdOrderByCategoryAsc(tripId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetSummaryResponse getBudgetSummary(UUID tripId, UUID userId) {
        verifyTripAccess(tripId, userId);

        BigDecimal totalEstimated = budgetRepository.getTotalEstimated(tripId);
        BigDecimal totalActual = budgetRepository.getTotalActual(tripId);
        BigDecimal totalVariance = totalEstimated.subtract(totalActual);

        BigDecimal usagePercentage = BigDecimal.ZERO;
        if (totalEstimated.compareTo(BigDecimal.ZERO) > 0) {
            usagePercentage = totalActual
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalEstimated, 2, RoundingMode.HALF_UP);
        }

        List<BudgetSummaryResponse.CategoryBreakdown> categories =
                budgetRepository.getCategoryBreakdown(tripId).stream()
                        .map(row -> BudgetSummaryResponse.CategoryBreakdown.builder()
                                .category((String) row[0])
                                .estimated((BigDecimal) row[1])
                                .actual((BigDecimal) row[2])
                                .variance(((BigDecimal) row[1]).subtract((BigDecimal) row[2]))
                                .build())
                        .collect(Collectors.toList());

        return BudgetSummaryResponse.builder()
                .totalEstimated(totalEstimated)
                .totalActual(totalActual)
                .totalVariance(totalVariance)
                .usagePercentage(usagePercentage)
                .categories(categories)
                .build();
    }

    @Override
    public BudgetResponse updateBudgetItem(UUID tripId, UUID budgetId, UUID userId, BudgetRequest request) {
        verifyTripAccess(tripId, userId);
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget item not found"));

        budget.setCategory(request.getCategory());
        budget.setEstimatedAmount(request.getEstimatedAmount());
        if (request.getActualAmount() != null) {
            budget.setActualAmount(request.getActualAmount());
        }

        return toResponse(budgetRepository.save(budget));
    }

    @Override
    public void deleteBudgetItem(UUID tripId, UUID budgetId, UUID userId) {
        verifyTripAccess(tripId, userId);
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget item not found"));
        budgetRepository.delete(budget);
        log.info("Budget item deleted: {} from trip {}", budgetId, tripId);
    }

    // ── Helpers ──

    private Trip verifyTripAccess(UUID tripId, UUID userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        boolean isOwner = trip.getUser().getUserId().equals(userId);
        boolean isCollaborator = collaboratorRepository.existsByTripTripIdAndUserUserId(tripId, userId);
        if (!isOwner && !isCollaborator) {
            throw new ResourceNotFoundException("Trip not found or access denied");
        }
        return trip;
    }

    private BudgetResponse toResponse(Budget budget) {
        return BudgetResponse.builder()
                .budgetId(budget.getBudgetId())
                .tripId(budget.getTrip().getTripId())
                .category(budget.getCategory())
                .estimatedAmount(budget.getEstimatedAmount())
                .actualAmount(budget.getActualAmount())
                .variance(budget.getEstimatedAmount().subtract(budget.getActualAmount()))
                .build();
    }
}
