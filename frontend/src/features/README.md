# Features Directory

This directory contains feature-based modules following the "feature slice" pattern.

Each feature is a self-contained module with its own:
- Components (feature-specific)
- Hooks
- API calls
- Business logic
- Types/interfaces

## Structure

### `/auth`
Authentication and authorization

**Contents:**
- `components/` - LoginForm, RegisterForm, etc.
- `hooks/` - useAuth, useLogin, useRegister
- `api/` - login(), register(), logout()
- `context/` - AuthContext, AuthProvider
- `types/` - User types, Auth types

### `/projects`
Project management feature

**Contents:**
- `components/` - ProjectCard, ProjectForm, ProjectList
- `hooks/` - useProjects, useProject, useCreateProject
- `api/` - getProjects(), createProject(), updateProject()
- `types/` - Project types

### `/graphs`
Graph visualization and management

**Contents:**
- `components/` - GraphCanvas, GraphControls, GraphToolbar
- `hooks/` - useGraph, useGraphNodes, useGraphConnections
- `api/` - getGraph(), createGraph(), updateGraph()
- `utils/` - Graph-specific utilities

### `/nodes`
Node management feature

**Contents:**
- `components/` - NodeCard, NodeForm, NodeDetail
- `hooks/` - useNodes, useNode, useCreateNode
- `api/` - getNodes(), createNode(), updateNode()

### `/connections`
Connection management feature

**Contents:**
- `components/` - ConnectionForm, ConnectionList
- `hooks/` - useConnections, useConnectionTypes
- `api/` - getConnections(), createConnection()

## Best Practices

1. **Feature isolation**: Each feature should be independent and reusable

2. **Co-location**: Keep related code together in the same feature folder

3. **Clear boundaries**: Features should communicate through well-defined APIs

4. **Shared logic**: Extract common logic to hooks or utils

## Feature Structure Template

```
auth/
├── components/           # Feature-specific components
│   ├── LoginForm/
│   │   ├── LoginForm.jsx
│   │   ├── LoginForm.module.css
│   │   └── index.js
│   └── RegisterForm/
├── hooks/               # Feature-specific hooks
│   ├── useAuth.js
│   ├── useLogin.js
│   └── useRegister.js
├── api/                 # Feature API calls
│   └── authApi.js
├── context/             # Feature context (if needed)
│   └── AuthContext.jsx
├── types/               # Feature types (if using TypeScript)
│   └── auth.types.ts
├── utils/               # Feature utilities
│   └── validation.js
└── index.js             # Public API exports
```

## Example Feature Module

```jsx
// features/auth/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// features/auth/api/authApi.js
import { apiClient } from '../../../services/api';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/jwt/login/', credentials);
    return response.data;
  },
  
  logout: async () => {
    // Clear tokens, etc.
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  }
};

// features/auth/components/LoginForm/LoginForm.jsx
import React from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Button, Input } from '../../../../components/common';

export const LoginForm = () => {
  const { login, isLoading, error } = useLogin();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};

// features/auth/index.js - Public API
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { useAuth } from './hooks/useAuth';
export { AuthProvider } from './context/AuthContext';
```
