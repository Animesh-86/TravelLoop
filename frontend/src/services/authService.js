/* ────────────────────────────────────────────
   Auth Service — API calls for authentication
   ──────────────────────────────────────────── */

import api from './api';

const authService = {
  /**
   * Register a new user
   * POST /auth/register
   * @param {{ fullName, email, password, phoneNumber?, city?, country? }} data
   * @returns {Promise<AuthResponse>}
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   * POST /auth/login
   * @param {{ email, password }} credentials
   * @returns {Promise<AuthResponse>}
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Refresh the access token
   * POST /auth/refresh
   * @param {string} refreshToken
   * @returns {Promise<AuthResponse>}
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Get current authenticated user details
   * GET /auth/me
   * @returns {Promise<UserResponse>}
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Login with Google ID Token
   * POST /auth/google-login
   * @param {string} idToken
   * @returns {Promise<AuthResponse>}
   */
  googleLogin: async (idToken) => {
    const response = await api.post('/auth/google-login', { idToken });
    return response.data;
  },
};

export default authService;
