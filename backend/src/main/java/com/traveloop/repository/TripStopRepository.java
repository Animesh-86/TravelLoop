package com.traveloop.repository;

import com.traveloop.model.entity.TripStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TripStopRepository extends JpaRepository<TripStop, UUID> {

    List<TripStop> findByTripTripIdOrderByStopOrderAsc(UUID tripId);

    void deleteByTripTripIdAndStopId(UUID tripId, UUID stopId);
}
