import apiClient from './apiClient.js';
import { API_ENDPOINTS } from '../../config/apiConfig.js';

// Auth Service - Handles all authentication operations
const authService = {
  // Login user
  async login(username, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      // Tokens are now stored in httpOnly cookies automatically
      // Keep localStorage for backwards compatibility during development
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      return response.data;
    } catch (error) {
      // Network error (no internet, server down)
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Server errors (500, 502, 503, 504)
      if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      // Unauthorized (401)
      if (error.response.status === 401) {
        throw new Error('Invalid username or password.');
      }

      // Too many requests (429)
      if (error.response.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Other client errors (400, 403, etc.)
      throw new Error(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      // Network error
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Server errors
      if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      // Validation errors (400)
      if (error.response.status === 400) {
        const errors = error.response.data;
        // Return structured errors
        throw errors;
      }

      // Conflict (username/email already exists)
      if (error.response.status === 409) {
        throw new Error('Username or email already exists.');
      }

      // Other errors
      throw new Error('Registration failed. Please try again.');
    }
  },

  // Logout user
  async logout() {
    try {
      // Call backend to clear httpOnly cookies
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if backend call fails, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ME);
      return response.data;
    } catch (error) {
      // Network error
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection.');
      }

      // Unauthorized - token invalid
      if (error.response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }

      throw new Error('Failed to get user data.');
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
};

export default authService;



