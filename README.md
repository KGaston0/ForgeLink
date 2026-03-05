# ForgeLink

A graph-based knowledge management application for worldbuilding, story design, and complex creative projects. Model knowledge as interconnected graphs with typed relationships, visual canvases, and project-scoped isolation.

- **Backend:** Django 4.2+ with Django REST Framework
- **Frontend:** React 19 + Vite 7 + Tailwind CSS v4
- **Database:** PostgreSQL (production) / SQLite (development)
- **Auth:** JWT with httpOnly cookies
- **Graph Editor:** @xyflow/react 12

---

## 📖 Documentation

| Document | Description |
|---|---|
| **[Quick Start](./QUICK_START.md)** | Get up and running in minutes |
| **[Development Guide](./DEVELOPMENT.md)** | Architecture, conventions, workflows, and design system |
| **[API Reference](./API_ENDPOINTS.md)** | Complete REST API documentation |
| **[Frontend](./frontend/README.md)** | Frontend setup, structure, routes, and styling |
| **[Component Library](./frontend/src/components/README.md)** | All 13 UI components with props reference |

---

## Features

### Core
- **Projects** — Isolated workspaces that contain all graphs, nodes, and connections
- **Graphs** — Visual canvases within a project for organizing knowledge
- **Nodes** — Typed entities (character, location, event, item, concept, note, frame)
- **Connections** — Typed directional relationships between nodes (forward, reverse, bidirectional, undirected)
- **Frames** — Special nodes that can contain other nodes within them

### Graph Editor
- Interactive canvas powered by @xyflow/react
- Drag-and-drop node creation from toolbar
- Frame nodes with child nesting and resizing
- Custom edge routing with directional arrows
- Node and edge editor modals
- Auto-save with debounce (bulk PUT endpoint)
- Undo/redo history

### Project Management
- Dashboard with real-time stats (projects, graphs, nodes)
- Recent projects section
- Project detail page with tab navigation (Overview / Settings)
- Create, edit, and delete projects
- Create graphs from within the project overview

### Security
- UUID-based public identifiers (no sequential IDs exposed in URLs)
- JWT authentication with httpOnly cookies (XSS protection)
- Security headers (XSS filter, X-Frame-Options, Content-Type nosniff)
- Owner-scoped queries (users can only access their own data)

---

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Django 4.2+ | Web framework |
| Django REST Framework | REST API |
| djangorestframework-simplejwt | JWT authentication |
| django-filter | Query filtering |
| django-cors-headers | CORS support |
| psycopg2-binary | PostgreSQL driver |
| python-decouple | Environment variables |

### Frontend
| Package | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool / dev server |
| Tailwind CSS v4 | Utility-first CSS with CSS variables |
| @xyflow/react 12 | Interactive graph editor |
| axios | HTTP client with interceptors |
| react-router-dom 7 | Routing (nested routes) |
| @heroicons/react | Icon library |

---

## Data Models

```
User (AbstractUser + membership)
 └── Project (uuid, name, description)
      ├── Node (title, node_type, content, custom_properties, parent_node)
      ├── Graph (uuid, name, description)
      │    ├── GraphNode (node, position, color, is_frame, width, height, parent_node)
      │    └── NodeConnection (source_node, target_node, connection_type, direction, label)
      └── ConnectionType (name, description, color)
```

> Nodes belong to a Project and can appear in multiple Graphs via GraphNode.
> Connections are graph-scoped but link project-scoped nodes.

See [Development Guide → Data Models](./DEVELOPMENT.md#data-models) for full field reference.

---

## Frontend Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard (stats + recent projects) | Protected |
| `/projects` | Projects list | Protected |
| `/projects/:uuid` | Project detail → Overview tab | Protected |
| `/projects/:uuid/settings` | Project detail → Settings tab | Protected |
| `/graphs/:uuid` | Graph canvas editor | Protected |
| `/settings` | User settings | Protected |

---

## Project Structure

```
ForgeLink/
├── forgelink_backend/            # Django project config
│   ├── settings.py               # Settings
│   ├── urls.py                   # Root URL config
│   ├── auth_views.py             # JWT cookie auth views
│   └── authentication.py         # Custom auth backend
│
├── apps/                         # Django apps
│   ├── users/                    # Custom User model + membership
│   ├── projects/                 # Projects + signals (auto-create on register)
│   ├── nodes/                    # Nodes (entities)
│   ├── graphs/                   # Graphs + GraphNodes (canvases)
│   └── connections/              # ConnectionTypes + NodeConnections
│
├── frontend/src/                 # React SPA
│   ├── components/               # Reusable UI
│   │   ├── common/               # Badge, Button, Card, LoadingSpinner, ThemeToggle
│   │   ├── landing/              # HeroSection, BentoGrid, DualPurpose, PricingSection, CTASection
│   │   └── layout/               # Footer, Navigation, Sidebar
│   ├── pages/                    # Route pages
│   │   ├── auth/                 # LoginPage, RegisterPage
│   │   ├── home/                 # Dashboard, useDashboardStats
│   │   ├── projects/             # ProjectsPage, ProjectDetailLayout
│   │   │   └── tabs/             # OverviewTab, SettingsTab
│   │   ├── graphs/               # GraphCanvasPage
│   │   └── settings/             # SettingsPage
│   ├── features/graphs/          # Graph editor feature module
│   │   ├── api/                  # graphService.js
│   │   ├── components/           # GraphCanvas, Toolbar, modals
│   │   │   ├── nodes/            # BaseNode, StandardNode, FrameNode
│   │   │   └── edges/            # CustomEdge, edgeConstants
│   │   └── hooks/                # useUndoRedo
│   ├── services/api/             # apiClient (axios + interceptors)
│   ├── context/                  # AuthContext, ThemeContext
│   ├── config/                   # apiConfig
│   └── routes/                   # ProtectedRoute
│
├── dev.sh                        # Start backend + frontend (tmux)
├── setup.sh                      # Initial project setup
├── helpers.sh                    # Development utilities
└── requirements.txt              # Python dependencies
```

---

## Roadmap

### Backend
- [x] REST API with full CRUD for all models
- [x] JWT authentication with httpOnly cookies
- [x] UUID-based public identifiers for Projects and Graphs
- [x] Bulk canvas save endpoint
- [x] Auto-creation of initial project + graph on user registration
- [ ] Role-based permissions and sharing
- [ ] Versioning and history
- [ ] Realtime collaboration (WebSockets)

### Frontend
- [x] Landing page with modular components
- [x] Design system with dark/light mode (CSS variables + Tailwind v4)
- [x] JWT authentication flow (login, register, refresh, logout)
- [x] Dashboard with real-time stats and recent projects
- [x] Projects page with CRUD
- [x] Project detail with tab layout (Overview / Settings)
- [x] Graph canvas editor with @xyflow/react
- [x] Node types: standard + frame with nesting
- [x] Custom edges with direction support
- [x] Auto-save with undo/redo
- [ ] Node Lab (custom node type management)
- [ ] Collaboration and sharing UI
- [ ] Export/Import

### DevOps
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## License

This project is licensed under the MIT License.
