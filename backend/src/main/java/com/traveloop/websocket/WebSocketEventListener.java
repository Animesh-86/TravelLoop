package com.traveloop.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.UUID;

/**
 * Listens for WebSocket lifecycle events (connect, disconnect).
 * On disconnect, cleans up the user's presence from any active trip session.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final TripWebSocketController tripWebSocketController;

    @EventListener
    public void handleWebSocketConnect(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        log.debug("WebSocket connected: session={}", accessor.getSessionId());
    }

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Map<String, Object> attrs = accessor.getSessionAttributes();

        if (attrs != null && attrs.containsKey("tripId")) {
            UUID tripId = (UUID) attrs.get("tripId");
            UUID userId = (UUID) attrs.get("userId");
            String userName = (String) attrs.getOrDefault("userName", "Unknown");

            log.info("WebSocket disconnected: user='{}' from trip={}", userName, tripId);
            tripWebSocketController.handleDisconnect(tripId, userId, userName);
        } else {
            log.debug("WebSocket disconnected: session={} (no trip context)",
                    accessor.getSessionId());
        }
    }
}
