// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/jwt/login/',
  REFRESH: '/auth/jwt/refresh/',
  LOGOUT: '/auth/jwt/logout/',
  REGISTER: '/users/',
  ME: '/users/me/',
  AUTH_ME: '/auth/me/',
};

