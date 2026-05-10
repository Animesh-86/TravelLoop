package com.traveloop.repository;

import com.traveloop.model.entity.TripNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TripNoteRepository extends JpaRepository<TripNote, UUID> {

    List<TripNote> findByTripTripIdOrderByCreatedAtDesc(UUID tripId);

    List<TripNote> findByStopStopIdOrderByCreatedAtDesc(UUID stopId);
}
