package com.traveloop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "trip_stops", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"trip_id", "stop_order"})
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TripStop {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "stop_id", updatable = false, nullable = false)
    private UUID stopId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @Column(name = "stop_order", nullable = false)
    private Integer stopOrder;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "stop", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TripActivity> activities = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
