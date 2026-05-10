/* ────────────────────────────────────────────
   tripService — Trip CRUD API calls
   ──────────────────────────────────────────── */

import api from './api';

const tripService = {
  createTrip: (data) => api.post('/api/trips', data).then((r) => r.data),

  getMyTrips: () => api.get('/api/trips/my').then((r) => r.data),

  getTripById: (tripId) => api.get(`/api/trips/${tripId}`).then((r) => r.data),

  updateTrip: (tripId, data) =>
    api.put(`/api/trips/${tripId}`, data).then((r) => r.data),

  deleteTrip: (tripId) => api.delete(`/api/trips/${tripId}`),

  updateTripStatus: (tripId, status) =>
    api.patch(`/api/trips/${tripId}/status`, { status }).then((r) => r.data),

  generateShareLink: (tripId) =>
    api.post(`/api/trips/${tripId}/share`).then((r) => r.data),

  getPublicTrips: () => api.get('/api/trips/public').then((r) => r.data),

  getTripByShareToken: (token) =>
    api.get(`/api/trips/share/${token}`).then((r) => r.data),
};

export default tripService;
