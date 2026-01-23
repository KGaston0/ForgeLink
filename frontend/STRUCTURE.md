# Frontend Structure Overview

## 📁 Complete Directory Structure

```
frontend/
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Main frontend documentation
├── public/                  # Static public files
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
└── src/                     # Source code
    ├── assets/              # Static assets
    │   ├── images/
    │   ├── icons/
    │   └── fonts/
    ├── components/          # Reusable UI components
    │   ├── common/         # Generic components (Button, Input, etc.)
    │   ├── layout/         # Layout components (Header, Sidebar, etc.)
    │   └── README.md
    ├── pages/               # Page components (route-based)
    │   ├── auth/           # Login, Register pages
    │   ├── home/           # Dashboard/Home page
    │   ├── projects/       # Project pages
    │   ├── graphs/         # Graph pages
    │   ├── nodes/          # Node pages
    │   └── README.md
    ├── features/            # Feature modules (business logic)
    │   ├── auth/           # Authentication feature
    │   ├── projects/       # Projects feature
    │   ├── graphs/         # Graphs feature
    │   ├── nodes/          # Nodes feature
    │   ├── connections/    # Connections feature
    │   └── README.md
    ├── services/            # External services
    │   ├── api/            # API client configuration
    │   └── README.md
    ├── hooks/               # Custom React hooks
    │   └── README.md
    ├── context/             # React Context providers
    │   └── README.md
    ├── routes/              # Route configuration
    ├── utils/               # Utility functions
    │   └── README.md
    ├── types/               # TypeScript types (if using TS)
    ├── config/              # App configuration
    └── styles/              # Global styles
        ├── themes/         # Theme definitions
        └── global/         # Global CSS
```

## 🎯 Key Directories Explained

### `/src/components`
**Purpose**: Reusable UI components
- `common/` - Generic components used everywhere (Button, Input, Modal)
- `layout/` - Structure components (Header, Footer, Sidebar)

**Example Structure**:
```
components/
├── common/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   ├── Button.test.jsx
│   │   └── index.js
│   └── Input/
└── layout/
    └── Header/
```

### `/src/pages`
**Purpose**: Page-level components that match routes
- Each folder represents a section of your app
- Pages compose features and components

**Example**:
```javascript
// pages/auth/LoginPage.jsx
import { LoginForm } from '../../features/auth';
import { AuthLayout } from '../../components/layout';

export const LoginPage = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);
```

### `/src/features`
**Purpose**: Self-contained feature modules
- Each feature has its own components, hooks, and logic
- Promotes modularity and maintainability

**Feature Structure**:
```
features/auth/
├── components/       # Feature-specific components
│   ├── LoginForm/
│   └── RegisterForm/
├── hooks/           # Feature-specific hooks
│   ├── useAuth.js
│   └── useLogin.js
├── api/             # API calls for this feature
│   └── authApi.js
├── context/         # Feature context (if needed)
│   └── AuthContext.jsx
└── index.js         # Public exports
```

### `/src/services`
**Purpose**: External service integrations
- API client configuration
- Request/response interceptors
- Error handling

### `/src/hooks`
**Purpose**: Reusable custom hooks
- `useFetch` - Data fetching
- `useLocalStorage` - Persist state
- `useDebounce` - Debounce values
- `useAuth` - Authentication state

### `/src/context`
**Purpose**: Global state management
- `AuthContext` - User authentication
- `ThemeContext` - UI theme
- `ToastContext` - Notifications

## 🚀 Getting Started

### 1. Initialize React Project

```bash
cd frontend
npx create-react-app . --template typescript  # If using TypeScript
# OR
npx create-react-app .  # For JavaScript
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install react-router-dom axios

# State management (optional)
npm install zustand
# OR
npm install @reduxjs/toolkit react-redux

# UI Library (choose one)
npm install @mui/material @emotion/react @emotion/styled
# OR
npm install tailwindcss postcss autoprefixer

# Form handling
npm install react-hook-form zod @hookform/resolvers

# Graph visualization
npm install reactflow
# OR
npm install d3

# Utilities
npm install date-fns classnames
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API URL
```

### 4. Start Development

```bash
npm start
```

## 📝 Development Workflow

### Creating a New Feature

1. **Create feature folder**:
   ```bash
   mkdir -p src/features/my-feature/{components,hooks,api}
   ```

2. **Add components**:
   ```bash
   mkdir src/features/my-feature/components/MyComponent
   ```

3. **Create API calls**:
   ```javascript
   // src/features/my-feature/api/myFeatureApi.js
   import { apiClient } from '../../../services/api/client';
   
   export const myFeatureApi = {
     getAll: () => apiClient.get('/my-endpoint/'),
     // ... other methods
   };
   ```

4. **Create custom hooks**:
   ```javascript
   // src/features/my-feature/hooks/useMyFeature.js
   export const useMyFeature = () => {
     // Hook logic
   };
   ```

5. **Export public API**:
   ```javascript
   // src/features/my-feature/index.js
   export { MyComponent } from './components/MyComponent';
   export { useMyFeature } from './hooks/useMyFeature';
   ```

### Creating a New Page

1. **Create page folder**:
   ```bash
   mkdir src/pages/my-page
   ```

2. **Add page component**:
   ```javascript
   // src/pages/my-page/MyPage.jsx
   export const MyPage = () => {
     return <div>My Page</div>;
   };
   ```

3. **Add route**:
   ```javascript
   // src/routes/index.jsx
   import { MyPage } from '../pages/my-page/MyPage';
   
   <Route path="/my-page" element={<MyPage />} />
   ```

## 🎨 Architecture Principles

1. **Separation of Concerns**: Each directory has a clear purpose
2. **Modularity**: Features are self-contained
3. **Reusability**: Components are composable
4. **Scalability**: Easy to add new features
5. **Testability**: Clear boundaries make testing easier
6. **Maintainability**: Organized structure reduces complexity

## 📚 Additional Resources

- **React Router**: https://reactrouter.com/
- **React Hook Form**: https://react-hook-form.com/
- **Axios**: https://axios-http.com/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **TanStack Query**: https://tanstack.com/query/latest

## 🔗 Related Documentation

- [Components README](./src/components/README.md)
- [Pages README](./src/pages/README.md)
- [Features README](./src/features/README.md)
- [Services README](./src/services/README.md)
- [Hooks README](./src/hooks/README.md)
- [Context README](./src/context/README.md)
- [Utils README](./src/utils/README.md)
