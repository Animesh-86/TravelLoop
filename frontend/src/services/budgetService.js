/* ────────────────────────────────────────────
   budgetService — Budget tracking API calls
   ──────────────────────────────────────────── */

import api from './api';

const budgetService = {
  getBudgetItems: (tripId) =>
    api.get(`/api/trips/${tripId}/budgets`).then((r) => r.data),

  addBudgetItem: (tripId, data) =>
    api.post(`/api/trips/${tripId}/budgets`, data).then((r) => r.data),

  updateBudgetItem: (tripId, budgetId, data) =>
    api
      .put(`/api/trips/${tripId}/budgets/${budgetId}`, data)
      .then((r) => r.data),

  deleteBudgetItem: (tripId, budgetId) =>
    api.delete(`/api/trips/${tripId}/budgets/${budgetId}`),

  getBudgetSummary: (tripId) =>
    api.get(`/api/trips/${tripId}/budgets/summary`).then((r) => r.data),
};

export default budgetService;
