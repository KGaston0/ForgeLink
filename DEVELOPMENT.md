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

**Response fields** (from `GET /graphs/{uuid}/canvas/`):
- `hidden_children_count` — Number of child nodes not displayed due to depth filtering (used to show "X hidden" indicators)

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

**Response fields** (from `GET /graphs/{uuid}/canvas/`):
- `is_hoisted` — true if the connection links nodes from different depth levels (appears in visible subset)

### Hierarchy (Canvas Response)
Response-only structure for building the sidebar explorer tree. Sent in the `hierarchy` field of `GET /graphs/{uuid}/canvas/`.

| Field | Type | Description |
|---|---|---|
| id | Integer | GraphNode ID |
| name | String | Node title (from Node.title) |
| parent_id | Integer or null | Parent GraphNode ID (null for root nodes) |
| is_frame | Boolean | Whether this is a frame node |

**Purpose:** Build a complete tree structure on the frontend for real-time sidebar explorer, independent of depth filtering.

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
1. `fetchCanvasData(graphUuid, currentFolderId, depth)` → loads graph info, nodes (GraphNodes), connections, and full node hierarchy
2. Maps backend data to ReactFlow nodes/edges format
3. User interactions modify local ReactFlow state
4. `saveCanvasBulk(graphUuid, projectId, payload)` → debounced auto-save (2.5s after last change)
5. Response maps temp IDs to real backend IDs

**ID handling:** The URL uses UUID (`graphUuid`), but internal data operations (FK references in graph-nodes, connections) use integer IDs obtained from `fetchCanvasData` response.

**Sidebar Synchronization:**
- Canvas receives `hierarchy` from the backend (complete tree structure of all nodes)
- Canvas builds a tree structure and dispatches `canvas-frames-updated` event with the tree
- Sidebar listens for `canvas-frames-updated` and renders the explorer tree
- Sidebar dispatches `sidebar-ready` on mount, which triggers Canvas to re-emit the tree if available
- This bi-directional handshake ensures Sidebar always gets data even if it mounts after Canvas loads data

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

### Frontend Custom Events

The frontend uses `window` events for cross-component communication:

| Event | Dispatched by | Listened by | Payload | Purpose |
|---|---|---|---|---|
| `canvas-frames-updated` | GraphCanvas | Sidebar | `detail: tree` (hierarchy array) | Notify Sidebar of full node tree structure |
| `sidebar-ready` | Sidebar | GraphCanvas | `undefined` | Handshake: Sidebar signals it's mounted and ready for data |
| `canvas-folder-changed` | GraphCanvas | Sidebar | `detail: folderId` | Notify Sidebar of current drill-down folder |

**Example usage:**
```javascript
// Dispatch event
window.dispatchEvent(new CustomEvent('canvas-frames-updated', { detail: tree }));

// Listen for event
const handler = (e) => console.log(e.detail);
window.addEventListener('canvas-frames-updated', handler);
window.removeEventListener('canvas-frames-updated', handler);
```

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

---

## ZUI Drill-down, Portals, and Sidebar Explorer

The Zoomable User Interface (ZUI) allows users to navigate complex graphs using a folder-like drill-down approach and cross-graph portals. The Sidebar provides a real-time tree explorer of all nodes.

### Architecture Overview

#### 0. Sidebar Explorer (Real-time Tree)
The sidebar displays a hierarchical tree of all nodes in the current graph, updated in real-time as the canvas changes.

- **Data Source:** The `hierarchy` field from `GET /graphs/{uuid}/canvas/`
- **Tree Building:** Canvas builds the tree from backend hierarchy data and dispatches `canvas-frames-updated` event
- **Synchronization:** 
  - Sidebar listens for `canvas-frames-updated` and renders the tree
  - Sidebar dispatches `sidebar-ready` event on mount
  - Canvas re-emits the tree when `sidebar-ready` is detected (ensures sync even if Sidebar mounts late)
- **Visual Indicators:** Each node shows whether it's a frame (folder icon) or regular node (document icon)

#### 1. Folder-like Drill-down (Nesting)
Instead of a literal camera zoom, the canvas implements a "memory-wipe" navigation where drilling into a frame clears the current nodes and loads only the children of that frame.

- **State Management:** The frontend tracks `currentFolderId` (the ID of the frame being viewed).
- **Backend Filtering:** When `folder_id` is provided to `GET /graphs/{uuid}/canvas/`, the API returns only nodes where `parent_node == folder_id`. If `folder_id` is null, it returns only root-level nodes.
- **Context-Aware Creation:** New nodes created while drilled down are automatically assigned the `currentFolderId` as their `parent_node`.
- **Navigation:** 
  - **Drill-down:** Double-clicking a FrameNode sets `currentFolderId` to that frame's ID and re-fetches data.
  - **Go Up:** Navigating back sets `currentFolderId` to the parent of the current folder (provided in the `current_folder` metadata from the API).
- **Atomic Navigation:** To prevent data loss, a bulk save (`PUT /graphs/{uuid}/canvas/bulk/`) MUST complete successfully before changing `currentFolderId` and re-fetching.

#### 2. Canvas Rendering & Physics
React Flow requires a specific `parentId` property for nested rendering, which can cause crashes if the parent is not present in the current node array (the "memory-wipe" scenario).

- **Conditional parentId:** In the frontend, `reactFlowNode.parentId` is assigned ONLY if the parent node exists in the current visible subset of nodes.
- **Top-level floating:** If a node's parent is the `currentFolderId` (and thus not rendered), the node is treated as a top-level root node in the current view to prevent coordinate clamping crashes.
- **Cascade Deletion:** Deleting a frame recursively deletes all nested children both in the frontend state and the backend (via `models.CASCADE` on the `parent_node` ForeignKey).

#### 3. Cross-Graph Portals
Portals allow users to link different graphs within the same project without breaking the 2D layout logic.

- **PortalNode:** A special node type that stores `target_graph_uuid` in its `custom_properties`.
- **Navigation:** Double-clicking a PortalNode triggers a route change to `/graphs/{target_graph_uuid}`.
- **Creation UI:** A dedicated modal allows users to select a target graph from the current project to create a new portal.

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
