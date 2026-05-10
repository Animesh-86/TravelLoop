/* ────────────────────────────────────────────
   aiService — AI itinerary generation API calls
   ──────────────────────────────────────────── */

import api from './api';

const aiService = {
  generateItinerary: (data) =>
    api.post('/api/ai/generate', data).then((r) => r.data),

  generateForTrip: (tripId, data) =>
    api.post(`/api/ai/trips/${tripId}/generate`, data).then((r) => r.data),

  regenerateItinerary: (tripId, prompt) =>
    api.post(`/api/ai/trips/${tripId}/regenerate`, { prompt }).then((r) => r.data),
};

export default aiService;
