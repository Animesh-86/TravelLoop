/* ────────────────────────────────────────────
   useCities — React Query hooks for cities
   ──────────────────────────────────────────── */

import { useQuery } from '@tanstack/react-query';
import cityService from '../services/cityService';

export function usePopularCities() {
  return useQuery({
    queryKey: ['cities', 'popular'],
    queryFn: cityService.getPopularCities,
    staleTime: 1000 * 60 * 10, // 10 min — cities rarely change
  });
}

export function useSearchCities(query) {
  return useQuery({
    queryKey: ['cities', 'search', query],
    queryFn: () => cityService.searchCities(query),
    enabled: query?.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ['cities', 'all'],
    queryFn: cityService.getAllCities,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ['cities', 'countries'],
    queryFn: cityService.getAllCountries,
    staleTime: 1000 * 60 * 30, // 30 min
  });
}

export function useBudgetCities(maxCost) {
  return useQuery({
    queryKey: ['cities', 'budget', maxCost],
    queryFn: () => cityService.getBudgetCities(maxCost),
    enabled: !!maxCost,
    staleTime: 1000 * 60 * 10,
  });
}
