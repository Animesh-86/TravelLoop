/* ────────────────────────────────────────────
   cityService — City/Destination API calls
   ──────────────────────────────────────────── */

import api from './api';

const cityService = {
  getAllCities: () => api.get('/api/cities').then((r) => r.data),

  getCityById: (cityId) =>
    api.get(`/api/cities/${cityId}`).then((r) => r.data),

  searchCities: (query) =>
    api.get('/api/cities/search', { params: { q: query } }).then((r) => r.data),

  getPopularCities: () => api.get('/api/cities/popular').then((r) => r.data),

  getCitiesByCountry: (country) =>
    api.get(`/api/cities/country/${country}`).then((r) => r.data),

  getBudgetCities: (maxCost) =>
    api.get('/api/cities/budget', { params: { maxCost } }).then((r) => r.data),

  getAllCountries: () => api.get('/api/cities/countries').then((r) => r.data),
};

export default cityService;
