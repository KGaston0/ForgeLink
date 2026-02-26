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


---

### 🔧 Helper Scripts Reference

Three helper scripts are available in the project root:

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup.sh` | Initial project setup (install deps, create venv) | `./setup.sh` |
| `dev.sh` | Start both backend and frontend servers | `./dev.sh` |
| `helpers.sh` | Common development commands | `./helpers.sh [command]` |

**Available helpers.sh commands:**
- `./helpers.sh check` - Check system status
- `./helpers.sh create-user` - Create new superuser
- `./helpers.sh reset-db` - Reset database (⚠️ deletes data)
- `./helpers.sh shell` - Open Django shell
- `./helpers.sh migrations` - Create and apply migrations
- `./helpers.sh static` - Collect static files
- `./helpers.sh test-backend` - Run backend tests
- `./helpers.sh urls` - Show all URL patterns

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
| React Frontend | http://localhost:5173/ | (Vite dev server) |

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

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run dev         # Vite

# Preview production build
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
│   ├── common/         # Generic components (Button, Input, Modal, Card, Badge)
│   └── layout/         # Layout components (Header, Sidebar, Footer, Navigation)
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
│   ├── ThemeContext.jsx    # 🎨 Theme/Dark mode
│   └── ToastContext.jsx
│
├── styles/             # 🎨 Design System
│   ├── variables.css      # CSS Variables (colors, fonts, spacing)
│   ├── globals.css        # Global styles and resets
│   └── theme/            # Theme system
│       ├── colors.css       # Color palettes
│       ├── typography.css   # Font system
│       ├── spacing.css      # Spacing scale
│       ├── breakpoints.css  # Responsive breakpoints
│       └── index.css        # Theme exports
│
├── routes/             # Route configuration
├── utils/              # Utility functions
├── types/              # TypeScript types (if using TS)
├── config/             # App configuration
├── assets/             # Static assets
└── App.jsx             # Main app component
```

### Architecture Principles

1. **Feature-Based Structure**: Each feature is self-contained with its own components, hooks, and logic
2. **Separation of Concerns**: Clear boundaries between UI, business logic, and data
3. **Component Reusability**: Generic components in `common/`, specific ones in features
4. **Modular Design**: Easy to add, remove, or modify features
5. **Testing Ready**: Clear structure makes testing easier

---

## 🎨 Design System & Theming

### CSS Variables System

All design tokens are centralized in `styles/variables.css`:

```css
:root {
  /* ========== COLORS - LIGHT MODE ========== */
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-surface-hover: #e9ecef;
  --color-text: #1a1a1f;
  --color-text-secondary: #6b7280;
  --color-border: rgba(0, 0, 0, 0.08);
  
  /* ========== COLORS - ACCENTS ========== */
  --color-cyan: #06b6d4;
  --color-teal: #14b8a6;
  --color-pink: #ec4899;
  --color-purple: #a855f7;
  
  /* ========== TYPOGRAPHY ========== */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 3rem;
  
  /* ========== SPACING (8pt Grid) ========== */
  --space-xs: 0.5rem;    /* 8px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 3rem;      /* 48px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */
  
  /* ========== LAYOUT ========== */
  --container-max-width: 1280px;
  --section-padding: 6rem 1.5rem;
  
  /* ========== EFFECTS ========== */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  
  --transition-fast: 150ms;
  --transition-base: 300ms;
  --transition-slow: 500ms;
}

/* ========== DARK MODE ========== */
[data-theme="dark"] {
  --color-bg: #0a0a0f;
  --color-surface: #13131a;
  --color-surface-hover: #1a1a24;
  --color-text: #e4e4e7;
  --color-text-secondary: #a1a1aa;
  --color-border: rgba(255, 255, 255, 0.08);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.5);
}
```

### Theme Context

The `ThemeContext` is already implemented in `frontend/src/context/ThemeContext.jsx`.

**Key features:**
- Reads theme from localStorage
- Detects system preference (`prefers-color-scheme`)
- Provides `theme`, `toggleTheme`, `isDark`, `isLight`

**Usage:**

```jsx
import { useTheme } from '../../context/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </header>
  );
}
```

### Reusable Components

Components are located in `frontend/src/components/`:

- **Common components** (`common/`): Button, Card, Badge, ThemeToggle
- **Layout components** (`layout/`): Navigation, Footer, Container
- **Landing components** (`landing/`): HeroSection, BentoGrid, PricingSection, etc.

**Example usage:**
```jsx
import { Button } from '@/components/common/Button/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle/ThemeToggle';

<Button variant="primary" size="lg">Click me</Button>
<ThemeToggle />
```

### Component Structure

```
ComponentName/
├── ComponentName.jsx    # Component logic
├── ComponentName.css    # Component styles (uses CSS variables)
└── index.js             # Export (optional)
```

All components use CSS variables from `styles/variables.css` for theming.

### Landing Page Modularization

The landing page is split into reusable sections:

- `<Navigation />` - Top navigation bar (reusable in all pages)
- `<HeroSection />` - Hero with animated node canvas
- `<BentoGrid />` - Feature showcase in bento layout
- `<DualPurpose />` - Use cases section
- `<PricingSection />` - Pricing table
- `<CTASection />` - Call to action
- `<Footer />` - Footer (reusable in all pages)

Each section is independent and can be used in other pages.

### Global Styles Setup

**Import order in `main.jsx`:**

1. `./styles/variables.css` - Variables first
2. `./styles/globals.css` - Reset and base
3. Wrap app with `<ThemeProvider>`


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

### Frontend

**Core (installed):**
- ✅ `react-router-dom` - Routing
- ✅ `axios` - HTTP client

**UI & Styling (installed):**
- ✅ `tailwindcss` - Utility-first CSS framework
- ✅ `@tailwindcss/postcss` - PostCSS plugin for Tailwind v4
- ✅ `autoprefixer` - CSS vendor prefixes

**Graph Visualization (installed):**
- ✅ `@xyflow/react` - Interactive node-based graphs
- ✅ `@heroicons/react` - Icon library

**To install (when needed):**
- `zustand` or similar - State management
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `d3` - Advanced data visualization

**Utilities (to install when needed):**
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
- [Frontend README](frontend/README.md) - Frontend setup guide
- [Design System](./frontend/src/styles/README.md) - CSS Variables and theming

---

---

## 🚀 MVP Flow Implementado

### Flujo Inicial de Usuario

1. **Registro de Usuario:**
   - Al crear un nuevo usuario (vía registro o admin), un signal `post_save` automáticamente crea:
     - Un proyecto llamado "Mi Primer Proyecto"
     - Un grafo llamado "Grafo Principal" dentro de ese proyecto
   - Implementado en: `apps/projects/signals.py`

2. **Login y Redirección:**
   - Tras autenticarse, el sistema consulta `/api/graphs/`
   - Busca el grafo "Grafo Principal" y redirige automáticamente a `/graphs/:id`
   - Si no existe, redirige al dashboard
   - Implementado en: `frontend/src/pages/auth/LoginPage.jsx`

3. **Dashboard:**
   - Vista principal con sidebar de navegación
   - Muestra resumen de proyectos, grafos y nodos
   - Implementado en: `frontend/src/pages/home/Dashboard.jsx`

4. **Canvas de Grafo:**
   - Visualización interactiva con `@xyflow/react`
   - Consume `GET /api/graphs/{id}/canvas/` para obtener nodos y conexiones
   - Permite mover nodos y guardar posiciones con `PATCH /api/graph-nodes/{id}/`
   - Implementado en: `frontend/src/features/graphs/GraphCanvas.jsx`

### Componentes Clave

- **Sidebar:** Navegación lateral reutilizable (`frontend/src/components/layout/Sidebar/`)
- **GraphCanvas:** Canvas interactivo con @xyflow/react (`frontend/src/features/graphs/`)
- **GraphCanvasPage:** Página que integra Sidebar + GraphCanvas

---

**Last Updated:** 2026-02-24
