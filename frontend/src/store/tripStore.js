/* ────────────────────────────────────────────
   tripStore — Zustand store for trip UI state
   ──────────────────────────────────────────── */

import { create } from 'zustand';

const useTripStore = create((set) => ({
  /* ── Active tab on MyTrips page ── */
  activeTab: 'upcoming', // upcoming | active | completed
  setActiveTab: (tab) => set({ activeTab: tab }),

  /* ── Search / filter state ── */
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  selectedCountry: '',
  setSelectedCountry: (c) => set({ selectedCountry: c }),

  maxBudget: 5,
  setMaxBudget: (b) => set({ maxBudget: b }),

  sortBy: 'popularity', // popularity | name
  setSortBy: (s) => set({ sortBy: s }),

  /* ── Selected trip for detail views ── */
  selectedTripId: null,
  setSelectedTripId: (id) => set({ selectedTripId: id }),

  /* ── Create-trip form draft (persist across navigation) ── */
  tripDraft: null,
  setTripDraft: (draft) => set({ tripDraft: draft }),
  clearTripDraft: () => set({ tripDraft: null }),

  /* ── Reset all filters ── */
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCountry: '',
      maxBudget: 5,
      sortBy: 'popularity',
    }),
}));

export default useTripStore;
