# ForgeLink — Development Guide

Architecture, conventions, workflows, and design system reference.

---

## Project Structure

```
ForgeLink/
├── forgelink_backend/            # Django project config
│   ├── settings.py               # Settings (DB, JWT, CORS, security headers)
│   ├── urls.py                   # Root URL config
│   ├── auth_views.py             # JWT cookie authentication views
│   └── authentication.py         # Custom auth backend (cookie-based JWT)
│
├── apps/                         # Django apps
│   ├── users/                    # Custom User model (AbstractUser + membership)
│   ├── projects/                 # Projects + signals (auto-create on registration)
│   ├── nodes/                    # Nodes (typed entities with hierarchy)
│   ├── graphs/                   # Graphs + GraphNodes (canvas + layout)
│   └── connections/              # ConnectionTypes + NodeConnections
│
├── frontend/src/                 # React SPA
│   ├── App.jsx                   # Route definitions
│   ├── index.css                 # shadcn/ui HSL variables, component classes, React Flow overrides
│   ├── main.jsx                  # Entry point
│   │
│   ├── components/               # Shared UI components
│   │   ├── layout/Sidebar/       # Collapsible sidebar (shadcn + lucide-react + tooltips)
│   │   └── ui/                   # shadcn/ui primitives + app-level components
│   │       ├── avatar.jsx        #   Radix Avatar with gradient fallback
│   │       ├── button.jsx        #   CVA button with 6 variants + 4 sizes
│   │       ├── loading-spinner.jsx  # Theme-aware spinner (fullscreen / inline)
│   │       ├── separator.jsx     #   Radix Separator
│   │       ├── theme-toggle.jsx  #   Animated Sun/Moon toggle (lucide-react)
│   │       └── tooltip.jsx       #   Radix Tooltip with portal
│   │
│   ├── pages/                    # Route-level page components
│   │   ├── auth/                 # LoginPage, RegisterPage
│   │   ├── home/                 # Dashboard, useDashboardStats hook
│   │   ├── landing/              # LandingPage + co-located components
│   │   │   └── components/       #   Navigation, UserMenu, Footer, HeroSection,
│   │   │                         #   BentoGrid, DualPurpose, PricingSection, CTASection
│   │   ├── projects/             # ProjectsPage, ProjectDetailLayout
│   │   │   └── tabs/             # OverviewTab, SettingsTab
│   │   ├── graphs/               # GraphCanvasPage
│   │   ├── nodelab/              # NodeLabPage
│   │   │   └── tabs/             # BlueprintsTab, NodeListsTab
│   │   └── settings/             # SettingsPage
│   │
│   ├── features/graphs/          # Graph editor feature module
│   │   ├── api/graphService.js   # API calls (fetchCanvasData, saveCanvasBulk, etc.)
│   │   ├── components/
│   │   │   ├── GraphCanvas.jsx   # Main canvas (ReactFlow wrapper + auto-save)
│   │   │   ├── Toolbar.jsx       # Node creation toolbar
│   │   │   ├── NodeEditorModal.jsx
│   │   │   ├── EdgeEditorModal.jsx
│   │   │   ├── NodeLabModal.jsx
│   │   │   ├── nodes/            # BaseNode, StandardNode, FrameNode, ConnectionHandles
│   │   │   └── edges/            # CustomEdge, edgeConstants
│   │   └── hooks/useUndoRedo.js  # Undo/redo state management
│   │
│   ├── lib/utils.js              # cn() utility (clsx + tailwind-merge)
│   ├── services/api/             # apiClient (axios instance + token refresh interceptor)
│   ├── context/                  # AuthContext, ThemeContext
│   ├── config/apiConfig.js       # API base URL + endpoint constants
│   ├── routes/ProtectedRoute.jsx # Auth guard (redirects to /login)
│   └── types/NodeType.js         # Type definitions
│
├── components.json               # shadcn/ui configuration
├── dev.sh                        # Start backend + frontend in tmux
├── setup.sh                      # Initial project setup script
├── helpers.sh                    # Development utilities
└── requirements.txt              # Python dependencies
```

---

## Data Models

### User
Custom model extending `AbstractUser`. Added fields:

| Field | Type | Description |
|---|---|---|
| membership_type | CharField | `free`, `basic`, `premium`, `enterprise` |
| membership_start_date | DateTime | Nullable |
| membership_end_date | DateTime | Nullable |

### Project
| Field | Type | Description |
|---|---|---|
| uuid | UUIDField | Public identifier (used in URLs, auto-generated) |
| name | CharField(255) | Project name |
| description | TextField | Optional |
| owner | FK → User | CASCADE |
| created_at | DateTime | auto_now_add |
| updated_at | DateTime | auto_now |

**Ordering:** `-updated_at`

### Node
| Field | Type | Description |
|---|---|---|
| project | FK → Project | CASCADE |
| parent_node | FK → self | CASCADE, nullable (hierarchy) |
| title | CharField(255) | |
| node_type | CharField(50) | `character`, `location`, `event`, `item`, `concept`, `note`, `frame` |
| content | TextField | Optional body |
| custom_properties | JSONField | Extensible key-value data |

**Validations:** No self-referencing parent, no cross-project parent, no cyclic hierarchies.

### Graph
| Field | Type | Description |
|---|---|---|
| uuid | UUIDField | Public identifier (used in URLs) |
| project | FK → Project | CASCADE |
| name | CharField(255) | Unique per project |
| description | TextField | Optional |

**Constraint:** `UniqueConstraint(project, name)`

### GraphNode
Junction table: node membership + per-graph visual layout.

| Field | Type | Description |
|---|---|---|
| graph | FK → Graph | CASCADE |
| node | FK → Node | CASCADE |
| position_x / position_y | Float | Canvas coordinates |
| color | CharField(7) | Hex color, default `#3B82F6` |
| is_frame | Boolean | Frame node flag |
| width / height | Integer | Dimensions (default 400×300 for frames) |
| parent_node | FK → self | SET_NULL, nullable (nesting within frames) |

**Constraint:** `UniqueConstraint(graph, node)` — a node can only appear once per graph.
**Validation:** Node must belong to the same project as the graph.

### ConnectionType
| Field | Type | Description |
|---|---|---|
| project | FK → Project | CASCADE |
| name | CharField(100) | Unique per project |
| description | TextField | Optional |
| color | CharField(7) | Hex color for visualization |

### NodeConnection
| Field | Type | Description |
|---|---|---|
| graph | FK → Graph | CASCADE |
| source_node | FK → Node | CASCADE |
| target_node | FK → Node | CASCADE |
| connection_type | FK → ConnectionType | PROTECT |
| label | CharField(255) | Optional edge label |
| direction | CharField(15) | `forward`, `reverse`, `bidirectional`, `undirected` |
| source_handle_position | Float | Nullable, 0.0–1.0 perimeter position |
| target_handle_position | Float | Nullable, 0.0–1.0 perimeter position |

**Validations:** No self-connections, nodes must be in the same project as the graph, nodes must be present in the graph (via GraphNode), connection type must belong to the same project.

---

## Backend Architecture

### ViewSets & Lookup

| Resource | ViewSet | lookup_field | URL pattern |
|---|---|---|---|
| Project | `ProjectViewSet` | `uuid` | `/projects/{uuid}/` |
| Graph | `GraphViewSet` | `uuid` | `/graphs/{uuid}/` |
| Node | `NodeViewSet` | `pk` (default) | `/nodes/{id}/` |
| GraphNode | `GraphNodeViewSet` | `pk` | `/graph-nodes/{id}/` |
| Connection | `NodeConnectionViewSet` | `pk` | `/connections/{id}/` |
| ConnectionType | `ConnectionTypeViewSet` | `pk` | `/connection-types/{id}/` |

### Owner Scoping
All ViewSets filter querysets to the authenticated user's data:
- Projects: `owner=user`
- Graphs: `project__owner=user`
- Nodes: `project__owner=user`
- GraphNodes: `graph__project__owner=user`
- Connections: `graph__project__owner=user`

### Signals
`apps/projects/signals.py` — `post_save` on User creation:
1. Creates "Mi Primer Proyecto" (project)
2. Creates "Grafo Principal" (graph within that project)

### Canvas Bulk Endpoint
`PUT /graphs/{uuid}/canvas/bulk/` — Saves the entire canvas state in a single request. Handles:
- Creating new nodes + graph-nodes
- Updating existing graph-node positions and properties
- Creating new connections
- Updating existing connection properties
- Mapping frontend temp IDs to backend IDs in response

---

## Frontend Architecture

### Route Structure

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/:id" element={<ProjectDetailLayout />}>
    <Route index element={<OverviewTab />} />
    <Route path="settings" element={<SettingsTab />} />
  </Route>
  <Route path="/graphs/:id" element={<GraphCanvasPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Route>
```

> The `:id` param in URLs is always a **UUID** string.

### Authentication Flow
1. **Login:** `POST /auth/jwt/login/` → sets httpOnly cookies
2. **API calls:** `apiClient` (axios) sends cookies automatically
3. **Token refresh:** Interceptor catches 401, calls `/auth/jwt/refresh/`, retries original request
4. **Logout:** `POST /auth/jwt/logout/` → blacklists refresh token, clears cookies
5. **Route guard:** `ProtectedRoute` checks `AuthContext.isAuthenticated`, redirects to `/login`

### Graph Canvas Architecture

The graph editor has a layered architecture:

```
GraphCanvasPage (route page)
  └── GraphCanvas (ReactFlowProvider wrapper)
       └── GraphCanvasInner (main logic)
            ├── ReactFlow (canvas with custom node/edge types)
            ├── Toolbar (node creation)
            ├── NodeEditorModal (edit node properties)
            └── EdgeEditorModal (edit connection properties)
```

**Data flow:**
1. `fetchCanvasData(graphUuid)` → loads graph info, nodes (GraphNodes), connections
2. Maps backend data to ReactFlow nodes/edges format
3. User interactions modify local ReactFlow state
4. `saveCanvasBulk(graphUuid, projectId, payload)` → debounced auto-save (2.5s after last change)
5. Response maps temp IDs to real backend IDs

**ID handling:** The URL uses UUID (`graphUuid`), but internal data operations (FK references in graph-nodes, connections) use integer IDs obtained from `fetchCanvasData` response.

### Project Detail Layout

Tab-based navigation using React Router nested routes + `<Outlet>`:

```
ProjectDetailLayout (fetches project + graphs, renders tabs)
  ├── OverviewTab (graphs grid, create graph modal)
  └── SettingsTab (general settings form, danger zone)
       └── Sub-navigation: General | Danger Zone
```

Shared data is passed via `useOutletContext()`:
- `project` — Project object
- `graphs` — Array of graphs
- `addGraph(graph)` — Callback to add a new graph
- `updateProject(data)` — Callback to update project
- `projectId` — Internal integer ID (for FK operations)
- `projectUuid` — UUID string (for API URL paths)

---

## Design System

### Theme Architecture

Built on **shadcn/ui** with **Tailwind CSS v4** (CSS-based config, no `tailwind.config.js`).

All design tokens are defined as HSL values in `frontend/src/index.css`. The `@theme inline` block registers them as Tailwind colors so you can use classes like `bg-primary`, `text-muted-foreground`, `border-border`.

### CSS Variables (HSL format)

```css
:root {
  /* Core surfaces */
  --background: 220 16% 96%;        /* Warm gray (not pure white) */
  --foreground: 240 6% 10%;         /* Near-black text */
  --card: 220 14% 93%;              /* Card/panel background */
  --popover: 220 14% 93%;           /* Dropdown/modal background */

  /* Brand colors */
  --primary: 187 72% 43%;           /* Cyan — buttons, links, focus rings */
  --accent: 271 81% 56%;            /* Purple — gradients, secondary brand */

  /* Semantic */
  --muted: 220 14% 89%;             /* Subtle backgrounds */
  --muted-foreground: 220 9% 46%;   /* Secondary text */
  --destructive: 0 84% 60%;         /* Error/danger */
  --border: 220 13% 86%;            /* Borders */
  --ring: 187 72% 43%;              /* Focus ring (cyan) */

  /* Sidebar-specific */
  --sidebar: 220 16% 93%;
  --sidebar-foreground: 240 6% 10%;
  --sidebar-accent: 187 72% 43%;
  --sidebar-border: 220 13% 86%;
}

.dark {
  --background: 240 6% 10%;         /* Deep charcoal */
  --foreground: 210 40% 98%;        /* Off-white text */
  --card: 240 5% 12%;
  --primary: 187 72% 43%;           /* Cyan (same in both themes) */
  --accent: 271 81% 56%;            /* Purple (same in both themes) */
  --border: 240 4% 16%;
  /* ... */
}
```

**Usage:** `bg-background`, `text-foreground`, `text-primary`, `border-border`, `bg-card`, etc.

> Legacy variables (`--color-bg`, `--color-text`, etc.) are still defined for backward compatibility in unmigrated components. New code should always use the shadcn tokens.

### UI Components (`components/ui/`)

All components use the `cn()` utility (clsx + tailwind-merge) and follow shadcn/ui conventions:

| Component | File | Description |
|---|---|---|
| Button | `button.jsx` | 6 variants (default, destructive, outline, secondary, ghost, link) × 4 sizes |
| Avatar | `avatar.jsx` | Radix Avatar with image + fallback (gradient initials) |
| Tooltip | `tooltip.jsx` | Radix Tooltip with portal, used in collapsed sidebar |
| Separator | `separator.jsx` | Horizontal/vertical divider |
| LoadingSpinner | `loading-spinner.jsx` | Themed spinner, fullscreen overlay or inline |
| ThemeToggle | `theme-toggle.jsx` | Animated Sun/Moon icons with rotation transition |

### Global CSS Classes

Defined in `index.css` `@layer components`:

| Class | Description |
|---|---|
| `.btn-primary` | Brand gradient button (cyan → purple, 135deg) |
| `.btn-secondary` | Transparent bordered button |
| `.input-field` | Styled input with focus ring |
| `.input-error` | Red border variant for validation errors |

### Theme System

`ThemeContext` provides `theme`, `toggleTheme`, `isDark`, `isLight`. Reads from `localStorage`, falls back to system preference.

**Toggle:** Sets `dark` class on `<html>` element. All CSS variables swap via `.dark { ... }`.

### Typography

- **Font:** `Inter`, system-ui, sans-serif (registered via `@theme inline`)
- **Headings and body** use the same font stack for consistency

---

## Development Workflow

### Common Commands

```bash
# Backend
source .venv/bin/activate
python manage.py runserver          # Start backend
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py createsuperuser    # Create admin user
python manage.py shell              # Django shell
python manage.py test               # Run tests

# Frontend
cd frontend
npm run dev                         # Start dev server
npm run build                       # Production build
npm run preview                     # Preview build
npm run lint                        # ESLint
```

### Helper Scripts

| Script | Purpose |
|---|---|
| `./dev.sh` | Start backend + frontend in tmux |
| `./setup.sh` | Initial project setup |
| `./helpers.sh check` | System status check |
| `./helpers.sh reset-db` | Reset database (⚠️ deletes data) |
| `./helpers.sh shell` | Django shell |
| `./helpers.sh migrations` | Create + apply migrations |
| `./helpers.sh create-user` | Create superuser |
| `./helpers.sh urls` | List all URL patterns |

### Database

**Development:** SQLite (`db.sqlite3`) — no setup needed, auto-created on migrate.

**Production:** PostgreSQL. Configure in `.env`:
```env
DB_NAME=forgelink_db
DB_USER=forgelink_user
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### Adding a New Feature

1. **Backend:** Create models in the appropriate app, add serializers, ViewSet, register in `urls.py`
2. **Frontend:**
   - **Complex feature** (own state, multiple components, API): create `features/<feature>/` with `api/`, `components/`, `hooks/`
   - **Simple CRUD page**: create `pages/<feature>/` with the page + optional `tabs/`
   - **Page-specific components**: co-locate inside the page folder (e.g., `pages/landing/components/`)
   - **Shared primitive**: add to `components/ui/` following shadcn/ui conventions (kebab-case filename, `cn()` utility, `forwardRef`)
   - **Route**: register in `App.jsx`
3. **New shadcn component:** `npx shadcn@latest add <component>` or create manually in `components/ui/`

### Code Conventions

**Backend (Python):**
- PEP 8
- Docstrings on models and ViewSet actions
- `lookup_field = 'uuid'` for public-facing resources
- Owner-scoped querysets in all ViewSets

**Frontend (React):**
- Functional components with hooks
- One component per file
- Validation on `onChange` + `onBlur` (not just `onSubmit`)
- Disable submit buttons when form has errors
- `aria-*` attributes on all form elements
- `role="alert"` for errors, `role="status"` for success messages

---

## Troubleshooting

**Port in use:**
```bash
lsof -ti:8000 | xargs kill -9   # Backend
lsof -ti:5173 | xargs kill -9   # Frontend
```

**Migration conflicts:**
```bash
python manage.py migrate --fake-initial
```

**Stale Python cache:**
```bash
find . -type d -name __pycache__ -exec rm -rf {} +
```

**Node modules issues:**
```bash
cd frontend && rm -rf node_modules package-lock.json && npm install
```

---

## Access Points

| Service | URL |
|---|---|
| Frontend | http://localhost:5173/ |
| Backend API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |

---

**See also:**
- [Quick Start](./QUICK_START.md) — Get running in minutes
- [API Reference](./API_ENDPOINTS.md) — Complete endpoint documentation
- [Frontend](./frontend/README.md) — Frontend setup, structure, and routes
