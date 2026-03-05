# ForgeLink — Frontend

React SPA for ForgeLink. Interactive graph editor, project management, and dashboard.

---

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173/ — Requires backend running on http://localhost:8000/

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| React | 19.2 | UI library |
| Vite | 7 | Build tool / dev server |
| Tailwind CSS | v4 | Utility-first CSS with CSS variables |
| @xyflow/react | 12 | Interactive graph canvas editor |
| axios | 1.13 | HTTP client with cookie-based auth |
| react-router-dom | 7 | Nested routing |
| @heroicons/react | 2.2 | Icon library |

---

## Structure

```
src/
├── App.jsx                       # Route definitions
├── index.css                     # CSS variables, utility classes, React Flow overrides
├── main.jsx                      # Entry point
│
├── components/                   # Reusable UI (13 components)
│   ├── common/                   # Badge, Button, Card, LoadingSpinner, ThemeToggle
│   ├── landing/                  # HeroSection, BentoGrid, DualPurpose, PricingSection, CTASection
│   └── layout/                   # Footer, Navigation, Sidebar
│
├── pages/                        # Route pages
│   ├── LandingPage.jsx           # Public landing page
│   ├── auth/                     # LoginPage, RegisterPage
│   ├── home/                     # Dashboard + useDashboardStats hook
│   ├── projects/                 # ProjectsPage, ProjectDetailLayout
│   │   └── tabs/                 # OverviewTab (graphs), SettingsTab (edit/delete)
│   ├── graphs/                   # GraphCanvasPage
│   └── settings/                 # SettingsPage
│
├── features/graphs/              # Graph editor feature module
│   ├── api/graphService.js       # Canvas API (fetch, save bulk, CRUD)
│   ├── components/
│   │   ├── GraphCanvas.jsx       # Main canvas with auto-save + undo/redo
│   │   ├── Toolbar.jsx           # Drag-and-drop node creation
│   │   ├── NodeEditorModal.jsx   # Edit node properties
│   │   ├── EdgeEditorModal.jsx   # Edit connection properties
│   │   ├── nodes/                # BaseNode, StandardNode, FrameNode, ConnectionHandles
│   │   └── edges/                # CustomEdge, edgeConstants
│   └── hooks/useUndoRedo.js      # History state management
│
├── services/api/                 # apiClient (axios + token refresh interceptor)
├── context/                      # AuthContext, ThemeContext
├── config/apiConfig.js           # API base URL + endpoint constants
└── routes/ProtectedRoute.jsx     # Auth guard → redirects to /login
```

---

## Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard (stats + recent projects) | Protected |
| `/projects` | Projects list + create modal | Protected |
| `/projects/:uuid` | Project detail → Overview tab (graphs) | Protected |
| `/projects/:uuid/settings` | Project detail → Settings tab | Protected |
| `/graphs/:uuid` | Graph canvas editor | Protected |
| `/settings` | User settings | Protected |

> URL `:uuid` params are UUID strings, not integer IDs.

---

## Styling

**Tailwind CSS v4** with CSS variables for dark/light mode theming.

All design tokens defined in `index.css`:
- Color variables: `--color-bg`, `--color-text`, `--color-border`, etc.
- Dark mode: `html.dark` class toggles variable values
- Utility classes: `.btn-primary`, `.btn-secondary`, `.input-field`, `.input-error`
- React Flow overrides: theme-aware controls, edges, and backgrounds

Usage: `bg-[rgb(var(--color-bg))]`, `text-[rgb(var(--color-text-secondary))]`

---

## Documentation

| Document | Description |
|---|---|
| [Component Library](./src/components/README.md) | All 13 components with props reference |
| [Development Guide](../DEVELOPMENT.md) | Architecture, data models, design system, workflows |
| [API Reference](../API_ENDPOINTS.md) | Complete backend endpoint documentation |
| [Quick Start](../QUICK_START.md) | Full project setup instructions |
