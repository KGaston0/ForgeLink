# Pages Directory

This directory contains page-level components that represent different routes in the application.

## Structure

### `/auth`
Authentication-related pages

**Pages:**
- `LoginPage/` - User login
- `RegisterPage/` - User registration
- `ForgotPasswordPage/` - Password recovery
- `ResetPasswordPage/` - Password reset

### `/home`
Main dashboard/home page

**Pages:**
- `HomePage/` - Main dashboard after login

### `/projects`
Project management pages

**Pages:**
- `ProjectsListPage/` - List all projects
- `ProjectDetailPage/` - View/edit single project
- `CreateProjectPage/` - Create new project

### `/graphs`
Graph visualization and management

**Pages:**
- `GraphsListPage/` - List graphs for a project
- `GraphDetailPage/` - View/edit single graph
- `GraphCanvasPage/` - Interactive graph canvas

### `/nodes`
Node management pages

**Pages:**
- `NodesListPage/` - List all nodes
- `NodeDetailPage/` - View/edit single node
- `CreateNodePage/` - Create new node

## Best Practices

1. **One page per route**: Each page should correspond to a route in your app

2. **Keep pages thin**: Pages should compose features and components, not contain complex logic

3. **Use features**: Extract business logic to feature modules

4. **Layout composition**: Use layout components for consistent structure

## Page Template

```jsx
// LoginPage/LoginPage.jsx
import React from 'react';
import { AuthLayout } from '../../components/layout';
import { LoginForm } from '../../features/auth';

export const LoginPage = () => {
  return (
    <AuthLayout title="Welcome Back">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
```

## Routing Example

```jsx
// App.jsx or routes/index.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { HomePage } from './pages/home/HomePage';
import { ProjectsListPage } from './pages/projects/ProjectsListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```
