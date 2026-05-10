package com.traveloop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "packing_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PackingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "item_id", updatable = false, nullable = false)
    private UUID itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "item_name", nullable = false, length = 100)
    private String itemName;

    @Column(length = 50)
    @Builder.Default
    private String category = "general";

    @Column(name = "is_packed")
    @Builder.Default
    private Boolean isPacked = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
