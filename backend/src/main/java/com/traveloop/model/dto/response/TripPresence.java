package com.traveloop.model.dto.response;

import lombok.*;

import java.util.Set;
import java.util.UUID;

/**
 * Tracks which users are currently viewing/editing a trip.
 * Broadcast on user join/leave events.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripPresence {

    private UUID tripId;
    private Set<ActiveUser> activeUsers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActiveUser {
        private UUID userId;
        private String name;
        private String avatarUrl;
        private Long joinedAt;
    }
}
