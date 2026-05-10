/* ────────────────────────────────────────────
   useBudget — React Query hooks for budgets
   ──────────────────────────────────────────── */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import budgetService from '../services/budgetService';
import toast from 'react-hot-toast';

export function useBudgetItems(tripId) {
  return useQuery({
    queryKey: ['budgets', tripId],
    queryFn: () => budgetService.getBudgetItems(tripId),
    enabled: !!tripId,
  });
}

export function useBudgetSummary(tripId) {
  return useQuery({
    queryKey: ['budgets', tripId, 'summary'],
    queryFn: () => budgetService.getBudgetSummary(tripId),
    enabled: !!tripId,
  });
}

export function useAddBudgetItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, data }) =>
      budgetService.addBudgetItem(tripId, data),
    onSuccess: (_, { tripId }) => {
      qc.invalidateQueries({ queryKey: ['budgets', tripId] });
      toast.success('Budget item added');
    },
    onError: () => toast.error('Failed to add budget item'),
  });
}
