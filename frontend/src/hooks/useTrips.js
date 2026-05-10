/* ────────────────────────────────────────────
   useTrips — React Query hooks for trips
   ──────────────────────────────────────────── */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tripService from '../services/tripService';
import toast from 'react-hot-toast';

/* ── Queries ── */

export function useMyTrips() {
  return useQuery({
    queryKey: ['trips', 'my'],
    queryFn: tripService.getMyTrips,
    staleTime: 1000 * 60 * 2, // 2 min cache
  });
}

export function useTrip(tripId) {
  return useQuery({
    queryKey: ['trips', tripId],
    queryFn: () => tripService.getTripById(tripId),
    enabled: !!tripId,
  });
}

export function usePublicTrips() {
  return useQuery({
    queryKey: ['trips', 'public'],
    queryFn: tripService.getPublicTrips,
    staleTime: 1000 * 60 * 5,
  });
}

/* ── Mutations ── */

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip created successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    },
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, data }) => tripService.updateTrip(tripId, data),
    onSuccess: (_, { tripId }) => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Trip updated!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update trip');
    },
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tripService.deleteTrip,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete trip');
    },
  });
}

export function useUpdateTripStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, status }) =>
      tripService.updateTripStatus(tripId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Status updated');
    },
  });
}
