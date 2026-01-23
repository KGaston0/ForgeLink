# ForgeLink - Development Guide

Complete guide for development, project structure, and getting started.

---

## 📂 Project Structure

### Current Organization

```
ForgeLink/
├── .env                      # Environment variables (PostgreSQL config)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── README.md                # Main project documentation
├── API_ENDPOINTS.md         # API documentation
├── requirements.txt         # Python dependencies
├── manage.py                # Django management script
├── db.sqlite3               # SQLite DB (for development)
│
├── forgelink_backend/       # Django project settings
│   ├── settings.py          # Main settings
│   ├── urls.py              # URL configuration
│   ├── auth_views.py        # JWT authentication views
│   └── mvp_views.py         # MVP frontend view
│
├── apps/                    # All Django apps
│   ├── __init__.py
│   ├── projects/            # Project management
│   ├── nodes/               # Node management
│   ├── connections/         # Connection management
│   └── graphs/              # Graph management
│
├── frontend/                # React frontend (structure ready)
│   ├── src/                 # Source code
│   ├── public/              # Static files
│   ├── tests/               # Test files
│   ├── .env.example         # Frontend env template
│   ├── .gitignore           # Frontend git ignore
│   ├── README.md            # Frontend documentation
│   └── STRUCTURE.md         # Architecture guide
│
└── frontend_mvp/            # Legacy MVP (HTML/JS)
    ├── index.html
    └── README.md
```

---

## 🏗️ Project Reorganization

### What Changed

**Before:**
```
ForgeLink/
├── projects/
├── nodes/
├── connections/
├── graphs/
└── forgelink_backend/
```

**After:**
```
ForgeLink/
├── apps/
│   ├── projects/
│   ├── nodes/
│   ├── connections/
│   └── graphs/
├── forgelink_backend/
└── frontend/          # New
```

### Why This Structure?

1. **Clean Separation**: Backend apps are isolated in `apps/` directory
2. **Frontend Ready**: Clear space for React frontend development
3. **Scalability**: Easy to add new apps or frontend frameworks
4. **Professional Standard**: Follows industry best practices
5. **Team Collaboration**: Clear boundaries for different teams

### Changes Made

- ✅ Moved all Django apps to `apps/` directory
- ✅ Updated `settings.py` with new app paths (`apps.projects`, etc.)
- ✅ Updated all `apps.py` files with correct `name` attribute
- ✅ Fixed all cross-app imports
- ✅ Updated `urls.py` to use new paths
- ✅ Cleaned Python cache (`__pycache__`)
- ✅ Verified with `python manage.py check` - No errors

---

## 🚀 Quick Start

### Backend Setup

#### Prerequisites
- Python 3.10+
- PostgreSQL 12+ (or use SQLite for development)
- pip and virtualenv

#### Installation Steps

1. **Clone and navigate to project**
   ```bash
   git clone https://github.com/KGaston0/ForgeLink.git
   cd ForgeLink
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/Mac
   .venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

**Backend is now running at:** http://localhost:8000/api/

---

### Frontend Setup

The frontend structure is ready, but React needs to be initialized.

#### Option 1: Create React App (Recommended)

```bash
cd frontend

# Initialize React app
npx create-react-app .

# Install core dependencies
npm install react-router-dom axios zustand

# Install UI library (choose one)
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Install form handling
npm install react-hook-form zod @hookform/resolvers

# Install graph visualization
npm install reactflow

# Setup environment
cp .env.example .env

# Start dev server
npm start
```

**Frontend will run at:** http://localhost:3000/

#### Option 2: Vite (Faster alternative)

```bash
cd frontend

# Initialize with Vite
npm create vite@latest . -- --template react

# Install dependencies
npm install
npm install react-router-dom axios zustand

# Start dev server
npm run dev
```

---

## 🔐 Test Users

Pre-created users for testing:

### Superuser (Admin)
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Admin panel + Full API access

### Test User
- **Username:** `testuser`
- **Password:** `test123`
- **Access:** API access only

---

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Backend API | http://localhost:8000/api/ | - |
| Admin Panel | http://localhost:8000/admin/ | admin / admin123 |
| MVP Frontend | http://localhost:8000/mvp/ | testuser / test123 |
| React Frontend | http://localhost:3000/ | (after setup) |

---

## 📝 Common Commands

### Backend

```bash
# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Run development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Django shell
python manage.py shell

# Check for issues
python manage.py check

# Collect static files
python manage.py collectstatic
```

### Frontend (after initialization)

```bash
# Start development server
npm start           # Create React App
npm run dev         # Vite

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name

# Update dependencies
npm update
```

---

## 🎯 Frontend Architecture

### Directory Structure Explained

```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, Modal)
│   └── layout/         # Layout components (Header, Sidebar, Footer)
│
├── pages/              # Page components (one per route)
│   ├── auth/          # Login, Register pages
│   ├── home/          # Dashboard/Home
│   ├── projects/      # Projects pages
│   ├── graphs/        # Graphs pages
│   └── nodes/         # Nodes pages
│
├── features/           # Feature modules (business logic)
│   ├── auth/          # Authentication feature
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/       # Feature hooks
│   │   ├── api/         # API calls
│   │   └── index.js     # Public exports
│   ├── projects/
│   ├── graphs/
│   ├── nodes/
│   └── connections/
│
├── services/           # External services
│   └── api/           # API client configuration
│       ├── client.js      # Axios instance
│       ├── endpoints.js   # API endpoints
│       └── interceptors.js # Request/response interceptors
│
├── hooks/              # Custom React hooks
│   ├── useFetch.js
│   ├── useAuth.js
│   └── useLocalStorage.js
│
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
│
├── routes/             # Route configuration
├── utils/              # Utility functions
├── types/              # TypeScript types (if using TS)
├── config/             # App configuration
├── assets/             # Static assets
└── styles/             # Global styles
```

### Architecture Principles

1. **Feature-Based Structure**: Each feature is self-contained with its own components, hooks, and logic
2. **Separation of Concerns**: Clear boundaries between UI, business logic, and data
3. **Component Reusability**: Generic components in `common/`, specific ones in features
4. **Modular Design**: Easy to add, remove, or modify features
5. **Testing Ready**: Clear structure makes testing easier

---

## 📚 Development Workflow

### Creating a New Feature

1. **Create feature directory structure**
   ```bash
   mkdir -p frontend/src/features/my-feature/{components,hooks,api}
   ```

2. **Add API calls**
   ```javascript
   // frontend/src/features/my-feature/api/myFeatureApi.js
   import { apiClient } from '../../../services/api/client';
   
   export const myFeatureApi = {
     getAll: () => apiClient.get('/my-endpoint/'),
     getById: (id) => apiClient.get(`/my-endpoint/${id}/`),
     create: (data) => apiClient.post('/my-endpoint/', data),
     update: (id, data) => apiClient.patch(`/my-endpoint/${id}/`, data),
     delete: (id) => apiClient.delete(`/my-endpoint/${id}/`),
   };
   ```

3. **Create custom hook**
   ```javascript
   // frontend/src/features/my-feature/hooks/useMyFeature.js
   import { useState, useEffect } from 'react';
   import { myFeatureApi } from '../api/myFeatureApi';
   
   export const useMyFeature = () => {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(false);
     
     const fetchData = async () => {
       setLoading(true);
       try {
         const result = await myFeatureApi.getAll();
         setData(result);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     
     useEffect(() => {
       fetchData();
     }, []);
     
     return { data, loading, refetch: fetchData };
   };
   ```

4. **Export public API**
   ```javascript
   // frontend/src/features/my-feature/index.js
   export { MyComponent } from './components/MyComponent';
   export { useMyFeature } from './hooks/useMyFeature';
   export { myFeatureApi } from './api/myFeatureApi';
   ```

### Adding a New Page

1. **Create page component**
   ```javascript
   // frontend/src/pages/my-page/MyPage.jsx
   import { useMyFeature } from '../../features/my-feature';
   import { MainLayout } from '../../components/layout';
   
   export const MyPage = () => {
     const { data, loading } = useMyFeature();
     
     return (
       <MainLayout>
         <h1>My Page</h1>
         {loading ? <p>Loading...</p> : <div>{/* Render data */}</div>}
       </MainLayout>
     );
   };
   ```

2. **Add route**
   ```javascript
   // frontend/src/routes/index.jsx or App.jsx
   import { MyPage } from '../pages/my-page/MyPage';
   
   <Route path="/my-page" element={<MyPage />} />
   ```

---

## 🔧 Database Configuration

### Using PostgreSQL (Production)

1. **Create database and user**
   ```bash
   createdb forgelink_db
   createuser forgelink_user
   ```

2. **Set password and permissions**
   ```sql
   ALTER USER forgelink_user WITH PASSWORD 'your-secure-password';
   GRANT ALL PRIVILEGES ON DATABASE forgelink_db TO forgelink_user;
   ```

3. **Update .env file**
   ```env
   DB_NAME=forgelink_db
   DB_USER=forgelink_user
   DB_PASSWORD=your-secure-password
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

### Using SQLite (Development)

The project includes `db.sqlite3` for quick development. No setup needed, just run migrations:

```bash
python manage.py migrate
```

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test apps.projects

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- MyComponent.test.js
```

---

## 📦 Recommended Packages

### Backend
- ✅ Already installed in `requirements.txt`

### Frontend (to install)

**Core:**
- `react-router-dom` - Routing
- `axios` - HTTP client
- `zustand` - State management

**UI Library (choose one):**
- `@mui/material` - Material-UI
- `tailwindcss` - TailwindCSS

**Forms:**
- `react-hook-form` - Form handling
- `zod` - Schema validation

**Graph Visualization:**
- `reactflow` - Interactive graphs
- `d3` - Data visualization

**Utilities:**
- `date-fns` - Date formatting
- `classnames` - Conditional classes

---

## 🎨 Code Style

### Backend (Python)
- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions and classes
- Keep functions small and focused

### Frontend (JavaScript/React)
- Use functional components with hooks
- One component per file
- Use meaningful component names (PascalCase)
- Props validation with PropTypes or TypeScript
- Keep components under 200 lines

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Migration conflicts:**
```bash
python manage.py migrate --fake-initial
```

**Import errors after reorganization:**
```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
find . -name "*.pyc" -delete
```

### Frontend Issues

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 in use:**
```bash
# Use different port
PORT=3001 npm start
```

---

## 📖 Additional Documentation

- [Main README](./README.md) - Project overview
- [API Endpoints](./API_ENDPOINTS.md) - Complete API documentation
- [Frontend README](./frontend/README.md) - Frontend setup guide
- [Frontend Structure](./frontend/STRUCTURE.md) - Architecture details
- [Components Guide](./frontend/src/components/README.md)
- [Features Guide](./frontend/src/features/README.md)
- [Services Guide](./frontend/src/services/README.md)
- [Hooks Guide](./frontend/src/hooks/README.md)
- [Context Guide](./frontend/src/context/README.md)
- [Utils Guide](./frontend/src/utils/README.md)

---

## ✅ Next Steps

### Priority 1: Initialize Frontend
1. Choose React setup (CRA or Vite)
2. Install dependencies
3. Configure API client
4. Setup routing

### Priority 2: Implement Authentication
1. Login page
2. Auth context
3. Protected routes
4. Token management

### Priority 3: Core Features
1. Projects CRUD
2. Graphs visualization
3. Nodes management
4. Connections handling

---

**Last Updated:** 2026-01-23

This project is ready for development with a clean, scalable architecture! 🚀
