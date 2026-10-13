import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/apiConfig.js';

// Custom error for authentication failures
export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests (including httpOnly JWT cookies)
});

// Endpoints where a 401 means "bad credentials / no session", not "expired access token".
// Trying to refresh on these would turn a wrong password into a "Session expired" error.
const NO_REFRESH_ENDPOINTS = [
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.REFRESH,
  API_ENDPOINTS.LOGOUT,
];

// Share a single in-flight refresh between concurrent 401s. The backend rotates and
// blacklists refresh tokens, so parallel refreshes would invalidate each other.
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {}, { withCredentials: true })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skipRefresh = NO_REFRESH_ENDPOINTS.some((url) => originalRequest?.url?.includes(url));

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true;

      try {
        // Try to refresh using httpOnly cookie
        await refreshAccessToken();
      } catch {
        // Refresh failed, throw AuthenticationError for components to handle
        throw new AuthenticationError('Session expired. Please login again.');
      }

      // Refresh succeeded, retry original request
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;


