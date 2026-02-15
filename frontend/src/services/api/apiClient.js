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

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh using httpOnly cookie
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`,
          {},
          { withCredentials: true }
        );

        // If successful, retry original request
        if (response.status === 200) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, throw AuthenticationError for components to handle
        throw new AuthenticationError('Session expired. Please login again.');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


