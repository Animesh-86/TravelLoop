package com.traveloop.repository;

import com.traveloop.model.entity.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PackingItemRepository extends JpaRepository<PackingItem, UUID> {

    List<PackingItem> findByTripTripIdOrderByCategoryAscItemNameAsc(UUID tripId);

    long countByTripTripIdAndIsPackedTrue(UUID tripId);

    long countByTripTripId(UUID tripId);
}
