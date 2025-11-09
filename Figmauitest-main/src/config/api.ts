// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export const API_URL = `${API_BASE_URL}/api`;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login/',
  SIGNUP: '/auth/signup/',
  LOGOUT: '/auth/logout/',
  REFRESH: '/auth/refresh/',
  USER: '/auth/user/',
  
  // Hello endpoint (existing)
  HELLO: '/hello/',
} as const;

