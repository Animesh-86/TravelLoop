/* ────────────────────────────────────────────
   useAuth — Custom hook for auth operations
   ──────────────────────────────────────────── */

import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

/**
 * Hook to check auth state and optionally fetch user profile
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  } = useAuthStore();

  // Fetch user profile on mount if authenticated but user data is stale
  useEffect(() => {
    if (isAuthenticated && !user?.createdAt) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user?.createdAt, fetchCurrentUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  };
}
