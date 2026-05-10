/* ────────────────────────────────────────────
   Auth Store (Zustand) — Login State Management
   ──────────────────────────────────────────── */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Actions ──

      /**
       * Login user with email + password
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          set({
            user: {
              userId: response.userId,
              email: response.email,
              fullName: response.fullName,
              role: response.role,
            },
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Login failed. Please check your credentials.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Register a new user
       */
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          set({
            user: {
              userId: response.userId,
              email: response.email,
              fullName: response.fullName,
              role: response.role,
            },
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Registration failed. Please try again.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Logout — clear all auth state
       */
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Fetch current user profile from /auth/me
       */
      fetchCurrentUser: async () => {
        try {
          const userData = await authService.getCurrentUser();
          set({
            user: {
              userId: userData.userId,
              email: userData.email,
              fullName: userData.fullName,
              role: userData.role,
              phoneNumber: userData.phoneNumber,
              city: userData.city,
              country: userData.country,
              profilePhotoUrl: userData.profilePhotoUrl,
              createdAt: userData.createdAt,
            },
          });
        } catch (error) {
          // If fetching user fails (token expired), logout
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      /**
       * Clear any auth errors
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'travelloop-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
