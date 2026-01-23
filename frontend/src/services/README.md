# Services Directory

This directory contains external service integrations and API client configuration.

## Structure

### `/api`
API client and endpoint definitions

**Files:**
- `client.js` - Axios/Fetch client configuration
- `interceptors.js` - Request/response interceptors
- `endpoints.js` - API endpoint constants
- `errorHandler.js` - Global error handling

## API Client Template

```javascript
// services/api/client.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

## Endpoints Configuration

```javascript
// services/api/endpoints.js
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/jwt/login/',
    REFRESH: '/auth/jwt/refresh/',
    ME: '/auth/me/',
  },
  
  // Projects
  PROJECTS: {
    LIST: '/projects/',
    DETAIL: (id) => `/projects/${id}/`,
    NODES: (id) => `/projects/${id}/nodes/`,
    CONNECTIONS: (id) => `/projects/${id}/connections/`,
  },
  
  // Graphs
  GRAPHS: {
    LIST: '/graphs/',
    DETAIL: (id) => `/graphs/${id}/`,
    CANVAS: (id) => `/graphs/${id}/canvas/`,
  },
  
  // Nodes
  NODES: {
    LIST: '/nodes/',
    DETAIL: (id) => `/nodes/${id}/`,
    CONNECTIONS: (id) => `/nodes/${id}/connections/`,
  },
  
  // Connections
  CONNECTIONS: {
    LIST: '/connections/',
    DETAIL: (id) => `/connections/${id}/`,
  },
  
  // Connection Types
  CONNECTION_TYPES: {
    LIST: '/connection-types/',
    DETAIL: (id) => `/connection-types/${id}/`,
  },
  
  // Graph Nodes
  GRAPH_NODES: {
    LIST: '/graph-nodes/',
    DETAIL: (id) => `/graph-nodes/${id}/`,
  },
};
```

## Error Handler

```javascript
// services/api/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { message: 'Invalid request', details: data };
      case 401:
        return { message: 'Unauthorized', details: 'Please login again' };
      case 403:
        return { message: 'Forbidden', details: 'You don\'t have permission' };
      case 404:
        return { message: 'Not found', details: data };
      case 500:
        return { message: 'Server error', details: 'Please try again later' };
      default:
        return { message: 'Error', details: data };
    }
  } else if (error.request) {
    // Request made but no response
    return { message: 'Network error', details: 'Please check your connection' };
  } else {
    // Something else happened
    return { message: 'Error', details: error.message };
  }
};
```

## Usage in Features

```javascript
// features/projects/api/projectsApi.js
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { handleApiError } from '../../../services/api/errorHandler';

export const projectsApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.PROJECTS.LIST);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(ENDPOINTS.PROJECTS.DETAIL(id));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  create: async (data) => {
    try {
      const response = await apiClient.post(ENDPOINTS.PROJECTS.LIST, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(ENDPOINTS.PROJECTS.DETAIL(id), data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(ENDPOINTS.PROJECTS.DETAIL(id));
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
```
