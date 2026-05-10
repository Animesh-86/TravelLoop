package com.traveloop.repository;

import com.traveloop.model.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {

    List<Trip> findByUserUserIdOrderByCreatedAtDesc(UUID userId);

    List<Trip> findByStatusOrderByStartDateAsc(String status);

    Optional<Trip> findByShareToken(String shareToken);

    @Query("SELECT t FROM Trip t WHERE t.isPublic = true ORDER BY t.createdAt DESC")
    List<Trip> findPublicTrips();

    @Query("SELECT t FROM Trip t JOIN t.collaborators c WHERE c.user.userId = :userId ORDER BY t.createdAt DESC")
    List<Trip> findSharedWithUser(@Param("userId") UUID userId);

    long countByUserUserId(UUID userId);

    @Query("SELECT t.status, COUNT(t) FROM Trip t WHERE t.user.userId = :userId GROUP BY t.status")
    List<Object[]> countByStatusForUser(@Param("userId") UUID userId);
}
