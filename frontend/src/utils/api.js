import axios from 'axios';

// On Vercel the frontend and backend share the same domain, so use relative /api.
// Locally, point at the dev backend on port 5000.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Public instance (no auth needed) ──
export const api = axios.create({ baseURL: BASE });

// ── Authenticated instance (single shared instance with interceptor) ──
export const authedApi = axios.create({ baseURL: BASE });

// Interceptor runs just before every request — always reads the freshest token
authedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('vc_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ── Auth ──
export const authRegister  = (email, password, name) => api.post('/auth/register', { email, password, name });
export const authResendOtp = (email)                 => api.post('/auth/resend-otp', { email });
export const authVerifyOtp = (email, code)           => api.post('/auth/verify-otp', { email, code });
export const authLogin     = (email, password)       => api.post('/auth/login', { email, password });
export const authMe        = (token)                 =>
  axios.get(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });

// ── Items (authenticated) ──
export const getItems    = ()          => authedApi.get('/items');
export const addItem     = (data)      => authedApi.post('/items', data);
export const updateItem  = (id, data)  => authedApi.put(`/items/${id}`, data);
export const deleteItem  = (id)        => authedApi.delete(`/items/${id}`);
export const searchItems = (q)         => authedApi.get('/items/search', { params: { q } });
export const clearList   = ()          => authedApi.delete('/items');

// ── Suggestions (authenticated) ──
export const getHistorySuggestions      = ()     => authedApi.get('/suggestions/history');
export const getSeasonalSuggestions     = ()     => authedApi.get('/suggestions/seasonal');
export const getPopularSuggestions      = ()     => authedApi.get('/suggestions/popular');
export const getSubstitutes             = (item) => authedApi.get(`/suggestions/substitutes/${encodeURIComponent(item)}`);
export const getAutocompleteSuggestions = (q)    => authedApi.get('/suggestions/autocomplete', { params: { q } });

// ── Dishes ──
export const getDishes            = ()   => api.get('/dishes');
export const getRecommendedDishes = ()   => authedApi.get('/dishes/recommended');
export const getDish              = (id) => api.get(`/dishes/${id}`);
