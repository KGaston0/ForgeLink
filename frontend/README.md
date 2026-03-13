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

| Package | Version | Purpose                                                    |
|---|---|------------------------------------------------------------|
| React | 19.2 | UI library                                                 |
| Vite | 7 | Build tool / dev server                                    |
| Tailwind CSS | v4 | Utility-first CSS (CSS-based config, HSL variables)        |
| shadcn/ui | — | Component primitives (Radix UI + class-variance-authority) |
| lucide-react | — | Icon library                                               |
| @xyflow/react | 12 | Interactive graph canvas editor                            |
| axios | 1.13 | HTTP client with cookie-based auth                         |
| react-router-dom | 7 | Nested routing                                             |
| clsx + tailwind-merge | — | Class merging via `cn()` utility                           |

---

## Structure

```
src/
├── App.jsx                          # Route definitions
├── index.css                        # Theme variables (HSL), component classes, React Flow overrides
├── main.jsx                         # Entry point
│
├── components/                      # Shared UI
│   ├── layout/Sidebar/              # Collapsible sidebar (shadcn + lucide-react + tooltips)
│   └── ui/                          # shadcn/ui primitives + app-level components
│       ├── avatar.jsx               #   Avatar with gradient fallback
│       ├── button.jsx               #   Button with CVA variants (default, ghost, outline, etc.)
│       ├── loading-spinner.jsx      #   Themed spinner (fullscreen / inline)
│       ├── separator.jsx            #   Horizontal/vertical divider
│       ├── theme-toggle.jsx         #   Animated dark/light toggle
│       └── tooltip.jsx              #   Radix tooltip with portal
│
├── pages/                           # Route pages
│   ├── auth/                        # LoginPage, RegisterPage
│   ├── home/                        # Dashboard + useDashboardStats hook
│   ├── landing/                     # LandingPage + co-located components
│   │   └── components/              #   Navigation, UserMenu, Footer, HeroSection,
│   │                                #   BentoGrid, DualPurpose, PricingSection, CTASection
│   ├── projects/                    # ProjectsPage, ProjectDetailLayout
│   │   └── tabs/                    #   OverviewTab (graphs), SettingsTab (edit/delete)
│   ├── graphs/                      # GraphCanvasPage
│   ├── nodelab/                     # NodeLabPage
│   │   └── tabs/                    #   BlueprintsTab, NodeListsTab
│   └── settings/                    # SettingsPage
│
├── features/graphs/                 # Graph editor feature module
│   ├── api/graphService.js          # Canvas API (fetch, save bulk, CRUD)
│   ├── components/
│   │   ├── GraphCanvas.jsx          # Main canvas with auto-save + undo/redo
│   │   ├── Toolbar.jsx              # Drag-and-drop node creation
│   │   ├── NodeEditorModal.jsx      # Edit node properties
│   │   ├── EdgeEditorModal.jsx      # Edit connection properties
│   │   ├── nodes/                   # BaseNode, StandardNode, FrameNode, ConnectionHandles
│   │   └── edges/                   # CustomEdge, edgeConstants
│   └── hooks/useUndoRedo.js         # History state management
│
├── lib/utils.js                     # cn() utility (clsx + tailwind-merge)
├── services/api/                    # apiClient (axios + token refresh interceptor)
├── context/                         # AuthContext, ThemeContext
├── config/apiConfig.js              # API base URL + endpoint constants
├── routes/ProtectedRoute.jsx        # Auth guard → redirects to /login
└── types/NodeType.js                # Type definitions
```

### Architecture Principles

- **`components/ui/`** — Shared primitives reusable across the entire app. Follow shadcn/ui conventions (kebab-case filenames, `cn()`, `forwardRef`).
- **`components/layout/`** — Layout components shared across multiple pages (currently only Sidebar).
- **`pages/`** — Each route has its own folder. Page-specific components are co-located (e.g., `pages/landing/components/`).
- **`features/`** — Reserved for complex, self-contained domain modules with their own API, components, and hooks (currently only `graphs`).
- Simple CRUD pages (projects, settings, nodelab) stay in `pages/` — no need for a feature folder.

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
| `/node-types` | Node Lab | Protected |
| `/settings` | User settings | Protected |

> URL `:uuid` params are UUID strings, not integer IDs.

---

## Styling

### shadcn/ui + Tailwind CSS v4

All design tokens defined as **HSL values** in `index.css` via `@theme inline`. No `tailwind.config.js` needed (Tailwind v4 uses CSS-based configuration).

**Key tokens:**
- Surfaces: `bg-background`, `bg-card`, `bg-muted`, `bg-sidebar`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Brand: `text-primary` (cyan), `text-accent` (purple)
- Borders: `border-border`, `border-input`
- Focus: `ring-ring` (cyan)
- Errors: `text-destructive`, `border-destructive`

**Light theme:** Warm grays (not pure white) for a softer, premium feel.
**Dark theme:** Deep charcoal grays (not black).

**Legacy classes** (`.btn-primary`, `.btn-secondary`, `.input-field`, `.input-error`) are still available for components not yet migrated to shadcn Button.

### Path Alias

`@/` maps to `src/` — configured in `vite.config.js` and `jsconfig.json`. Use for all imports:
```js
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

---

## Documentation

| Document | Description |
|---|---|
| [Development Guide](../DEVELOPMENT.md) | Architecture, data models, design system, workflows |
| [API Reference](../API_ENDPOINTS.md) | Complete backend endpoint documentation |
| [Quick Start](../QUICK_START.md) | Full project setup instructions |
