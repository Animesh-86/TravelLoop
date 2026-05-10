/* ────────────────────────────────────────────
   adminService — Admin analytics API calls
   ──────────────────────────────────────────── */

import api from './api';

const adminService = {
  getStats: () => api.get('/api/admin/stats').then((r) => r.data),

  getAllUsers: () => api.get('/api/admin/users').then((r) => r.data),

  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
};

export default adminService;
