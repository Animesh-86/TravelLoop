package com.traveloop.model.dto.request;

import lombok.*;

import java.util.UUID;

/**
 * Payload sent via WebSocket when a user performs a real-time action on a trip.
 * Broadcast to all collaborators viewing the same trip.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripEditMessage {

    public enum EditType {
        STOP_ADDED,
        STOP_REMOVED,
        STOP_REORDERED,
        ACTIVITY_ADDED,
        ACTIVITY_REMOVED,
        BUDGET_UPDATED,
        NOTE_ADDED,
        PACKING_ITEM_TOGGLED,
        STATUS_CHANGED,
        CURSOR_MOVED,
        USER_JOINED,
        USER_LEFT
    }

    /** The trip being edited */
    private UUID tripId;

    /** The user performing the action */
    private UUID userId;
    private String userName;

    /** What type of edit */
    private EditType editType;

    /** Serialized payload (JSON string) of the edited entity */
    private String payload;

    /** Timestamp of the edit */
    private Long timestamp;
}
