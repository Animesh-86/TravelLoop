package com.traveloop.repository;

import com.traveloop.model.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {

    List<Budget> findByTripTripIdOrderByCategoryAsc(UUID tripId);

    @Query("SELECT COALESCE(SUM(b.estimatedAmount), 0) FROM Budget b WHERE b.trip.tripId = :tripId")
    BigDecimal getTotalEstimated(@Param("tripId") UUID tripId);

    @Query("SELECT COALESCE(SUM(b.actualAmount), 0) FROM Budget b WHERE b.trip.tripId = :tripId")
    BigDecimal getTotalActual(@Param("tripId") UUID tripId);

    @Query("SELECT b.category, SUM(b.estimatedAmount), SUM(b.actualAmount) " +
           "FROM Budget b WHERE b.trip.tripId = :tripId GROUP BY b.category")
    List<Object[]> getCategoryBreakdown(@Param("tripId") UUID tripId);

    void deleteByTripTripIdAndBudgetId(UUID tripId, UUID budgetId);
}
