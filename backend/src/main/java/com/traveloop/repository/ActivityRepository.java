package com.traveloop.repository;

import com.traveloop.model.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    List<Activity> findByCityCityIdOrderByRatingDesc(UUID cityId);

    List<Activity> findByCityCityIdAndCategoryIgnoreCase(UUID cityId, String category);

    List<Activity> findByCityCityIdAndEstimatedCostLessThanEqual(UUID cityId, java.math.BigDecimal maxCost);
}
