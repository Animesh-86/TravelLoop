package com.traveloop.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "activities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "activity_id", updatable = false, nullable = false)
    private UUID activityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(name = "activity_name", nullable = false, length = 200)
    private String activityName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "estimated_cost", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal estimatedCost = BigDecimal.ZERO;

    @Column(name = "duration_minutes")
    @Builder.Default
    private Integer durationMinutes = 60;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;
}
