package com.traveloop.websocket;

import com.traveloop.model.dto.request.TripEditMessage;
import com.traveloop.model.dto.response.TripPresence;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * STOMP WebSocket controller for real-time collaborative trip editing.
 *
 * Clients subscribe to: /topic/trip/{tripId}
 * Clients send to:      /app/trip/{tripId}/edit
 *                        /app/trip/{tripId}/join
 *                        /app/trip/{tripId}/leave
 *
 * The server broadcasts all edits to every user subscribed to the same trip channel.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class TripWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * In-memory presence tracking: tripId → set of active users.
     * For a hackathon this is fine; in production you'd use Redis.
     */
    private final Map<UUID, Set<TripPresence.ActiveUser>> presenceMap = new ConcurrentHashMap<>();

    /* ──────────────────────────────────────────────────
     *  /app/trip/{tripId}/edit
     *  Broadcast trip edits to all collaborators
     * ────────────────────────────────────────────────── */
    @MessageMapping("/trip/{tripId}/edit")
    public void handleTripEdit(@DestinationVariable UUID tripId,
                                @Payload TripEditMessage message) {
        message.setTripId(tripId);
        message.setTimestamp(System.currentTimeMillis());

        log.debug("Trip edit [{}] on trip={} by user={}",
                message.getEditType(), tripId, message.getUserName());

        // Broadcast to all subscribers of this trip
        messagingTemplate.convertAndSend(
                "/topic/trip/" + tripId, message);
    }

    /* ──────────────────────────────────────────────────
     *  /app/trip/{tripId}/join
     *  User joins a trip editing session
     * ────────────────────────────────────────────────── */
    @MessageMapping("/trip/{tripId}/join")
    public void handleUserJoin(@DestinationVariable UUID tripId,
                                @Payload TripPresence.ActiveUser user,
                                SimpMessageHeaderAccessor headerAccessor) {
        user.setJoinedAt(System.currentTimeMillis());

        presenceMap.computeIfAbsent(tripId, k -> ConcurrentHashMap.newKeySet())
                   .add(user);

        // Store user info in the WebSocket session for disconnect cleanup
        Objects.requireNonNull(headerAccessor.getSessionAttributes())
                .put("tripId", tripId);
        headerAccessor.getSessionAttributes().put("userId", user.getUserId());
        headerAccessor.getSessionAttributes().put("userName", user.getName());

        log.info("User '{}' joined trip={}", user.getName(), tripId);

        // Broadcast updated presence list
        broadcastPresence(tripId);

        // Also send a USER_JOINED edit event
        TripEditMessage joinMsg = TripEditMessage.builder()
                .tripId(tripId)
                .userId(user.getUserId())
                .userName(user.getName())
                .editType(TripEditMessage.EditType.USER_JOINED)
                .timestamp(System.currentTimeMillis())
                .build();
        messagingTemplate.convertAndSend("/topic/trip/" + tripId, joinMsg);
    }

    /* ──────────────────────────────────────────────────
     *  /app/trip/{tripId}/leave
     *  User leaves a trip editing session
     * ────────────────────────────────────────────────── */
    @MessageMapping("/trip/{tripId}/leave")
    public void handleUserLeave(@DestinationVariable UUID tripId,
                                 @Payload TripPresence.ActiveUser user) {
        removeUserFromTrip(tripId, user.getUserId(), user.getName());
    }

    /* ──────────────────────────────────────────────────
     *  /app/trip/{tripId}/cursor
     *  Broadcast cursor / focus position for live indicators
     * ────────────────────────────────────────────────── */
    @MessageMapping("/trip/{tripId}/cursor")
    public void handleCursorMove(@DestinationVariable UUID tripId,
                                  @Payload TripEditMessage message) {
        message.setTripId(tripId);
        message.setEditType(TripEditMessage.EditType.CURSOR_MOVED);
        message.setTimestamp(System.currentTimeMillis());

        // Broadcast cursor position to others
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/cursors", message);
    }

    /* ═══════════════════════════════════════════════════
     *  Public methods used by WebSocketEventListener
     * ═══════════════════════════════════════════════════ */

    /**
     * Called when a WebSocket session disconnects unexpectedly.
     */
    public void handleDisconnect(UUID tripId, UUID userId, String userName) {
        removeUserFromTrip(tripId, userId, userName);
    }

    /* ═══════════════════════════════════════════════════
     *  PRIVATE HELPERS
     * ═══════════════════════════════════════════════════ */

    private void removeUserFromTrip(UUID tripId, UUID userId, String userName) {
        Set<TripPresence.ActiveUser> users = presenceMap.get(tripId);
        if (users != null) {
            users.removeIf(u -> u.getUserId().equals(userId));
            if (users.isEmpty()) {
                presenceMap.remove(tripId);
            }
        }

        log.info("User '{}' left trip={}", userName, tripId);

        // Broadcast updated presence
        broadcastPresence(tripId);

        // Send a USER_LEFT event
        TripEditMessage leaveMsg = TripEditMessage.builder()
                .tripId(tripId)
                .userId(userId)
                .userName(userName)
                .editType(TripEditMessage.EditType.USER_LEFT)
                .timestamp(System.currentTimeMillis())
                .build();
        messagingTemplate.convertAndSend("/topic/trip/" + tripId, leaveMsg);
    }

    private void broadcastPresence(UUID tripId) {
        Set<TripPresence.ActiveUser> users = presenceMap.getOrDefault(tripId, Set.of());
        TripPresence presence = TripPresence.builder()
                .tripId(tripId)
                .activeUsers(users)
                .build();
        messagingTemplate.convertAndSend("/topic/trip/" + tripId + "/presence", presence);
    }
}
