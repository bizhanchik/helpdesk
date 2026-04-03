import axios from 'axios';

/**
 * Shared Axios instance.
 * - baseURL is empty so the Vite proxy handles /api/* → http://localhost:5000
 * - Request interceptor automatically attaches the JWT from localStorage
 * - Response interceptor redirects to /login on 401 (expired/invalid token)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hd_token');
      localStorage.removeItem('hd_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
