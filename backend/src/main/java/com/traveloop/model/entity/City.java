package com.traveloop.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "cities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "city_id", updatable = false, nullable = false)
    private UUID cityId;

    @Column(name = "city_name", nullable = false, length = 100)
    private String cityName;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(length = 100)
    private String region;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "cost_index")
    private Integer costIndex;

    @Column(name = "popularity_score")
    @Builder.Default
    private Integer popularityScore = 0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
