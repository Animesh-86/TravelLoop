/* ────────────────────────────────────────────
   useWebSocket — STOMP/SockJS hook for live collaboration
   ──────────────────────────────────────────── */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useAuthStore from '../store/authStore';

export default function useWebSocket(tripId) {
  const user = useAuthStore((s) => s.user);
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [lastEdit, setLastEdit] = useState(null);

  useEffect(() => {
    if (!tripId || !user) return;

    const token = useAuthStore.getState().accessToken;
    
    // In dev, API runs on 8080. In prod, it might be relative or full URL.
    // For now, construct the full URL.
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const wsUrl = `${baseUrl.replace('/api', '')}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      setConnected(true);

      // Subscribe to trip edits
      client.subscribe(`/topic/trip/${tripId}`, (msg) => {
        const data = JSON.parse(msg.body);
        setLastEdit(data);
      });

      // Subscribe to presence
      client.subscribe(`/topic/trip/${tripId}/presence`, (msg) => {
        const data = JSON.parse(msg.body);
        setActiveUsers(data.activeUsers || []);
      });

      // Announce join
      client.publish({
        destination: `/app/trip/${tripId}/join`,
        body: JSON.stringify({
          userId: user.userId,
          name: user.fullName,
        }),
      });
    };

    client.onDisconnect = () => setConnected(false);
    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: `/app/trip/${tripId}/leave`,
          body: JSON.stringify({
            userId: user.userId,
            name: user.fullName,
          }),
        });
      }
      clientRef.current?.deactivate();
    };
  }, [tripId, user]);

  const sendEdit = useCallback(
    (editType, payload = {}) => {
      if (!clientRef.current?.connected) return;
      clientRef.current.publish({
        destination: `/app/trip/${tripId}/edit`,
        body: JSON.stringify({
          userId: user?.userId,
          userName: user?.fullName,
          editType,
          ...payload,
        }),
      });
    },
    [tripId, user]
  );

  return { connected, activeUsers, lastEdit, sendEdit };
}
