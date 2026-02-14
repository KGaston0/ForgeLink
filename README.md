# ForgeLink

Django backend for a node-based project management and worldbuilding application.

- **Backend:** Django REST Framework API
- **Frontend:** React + Vite with modular design system
- **Database:** PostgreSQL
- **Auth:** JWT (in development)

---

## 📁 Project Structure

```
ForgeLink/
├── .env                      # Environment variables (PostgreSQL config)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── README.md                # Main project documentation
├── API_ENDPOINTS.md         # API documentation
├── DEVELOPMENT.md           # Development guide
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
├── apps/                    # Django apps
│   ├── __init__.py
│   ├── projects/            # Project management
│   ├── nodes/               # Node management
│   ├── connections/         # Connection management
│   └── graphs/              # Graph management
│
├── frontend/                # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Button, Card, Badge, ThemeToggle
│   │   │   ├── layout/      # Navigation, Footer
│   │   │   └── landing/     # Landing page sections
│   │   ├── pages/           # Page components (one per route)
│   │   │   ├── auth/        # Login, Register pages
│   │   │   ├── home/        # Dashboard/Home
│   │   │   ├── projects/    # Projects pages
│   │   │   ├── graphs/      # Graphs pages
│   │   │   └── nodes/       # Nodes pages
│   │   ├── features/        # Feature modules (business logic)
│   │   │   ├── auth/        # Authentication feature
│   │   │   ├── projects/    # Projects feature
│   │   │   ├── graphs/      # Graphs feature
│   │   │   ├── nodes/       # Nodes feature
│   │   │   └── connections/ # Connections feature
│   │   ├── services/        # External services (API client)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context providers (Theme, Auth)
│   │   ├── routes/          # Route configuration
│   │   ├── styles/          # Design system (CSS variables)
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # App configuration
│   │   └── assets/          # Static assets
│   ├── public/              # Static files
│   └── README.md            # Frontend documentation
│
└── frontend_mvp/            # Legacy MVP (HTML/JS)
    ├── index.html
    └── README.md
```

> **See detailed documentation:**
> - Frontend: [frontend/README.md](./frontend/README.md)
> - Development: [DEVELOPMENT.md](./DEVELOPMENT.md)
> - API: [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

## Features

ForgeLink provides a system for modeling knowledge as graphs, with isolated projects, typed relationships, and evolution over time. Suitable for worldbuilding, story design, and complex knowledge systems.

- Multiple node types: characters, locations, events, items, concepts, and notes
- Node connections with various relationship types
- Project-scoped isolation
- CORS support for frontend integration
- Extensible architecture for future authentication, permissions, and realtime features

---

## Tech Stack

### Backend
- **Language:** Python 3.10+
- **Framework:** Django 4.2+ with Django REST Framework
- **Database:** PostgreSQL
- **Auth:** JWT + httpOnly cookies
- **Libraries:**
  - django-cors-headers
  - django-filter
  - python-dotenv

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite
- **Styling:** Native CSS with CSS variables
- **Components:** 11 modular reusable components
- **Theme:** Dark/Light mode with design system
- **State:** React Context API

### DevOps
- **Version Control:** Git
- **Package Manager:** pip (backend), npm (frontend)
- **Development:** Hot reload on both (Django + Vite)

---

## 📚 Documentation

- **Frontend:** [frontend/README.md](./frontend/README.md)
- **Components:** [frontend/src/components/README.md](./frontend/src/components/README.md)
- **Design System:** [frontend/src/styles/README.md](./frontend/src/styles/README.md)
- **API Endpoints:** [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **Development Guide:** [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 🚀 Quick Start

### Backend (Django)

1. **Clone repository**
```bash
git clone https://github.com/KGaston0/ForgeLink.git
cd ForgeLink
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

5. **Setup PostgreSQL**
```bash
createdb forgelink_db
createuser forgelink_user
# See Installation section for more details
```

6. **Run migrations**
```bash
python manage.py migrate
python manage.py createsuperuser
```

7. **Start server**
```bash
python manage.py runserver
```

**Backend available at:** http://localhost:8000/api/

### Frontend (React)

1. **Go to frontend folder**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

**Frontend available at:** http://localhost:5173/

> 📘 **See complete frontend documentation:** [frontend/README.md](./frontend/README.md)

---

## Installation

1. Clone the repository  
```bash
   git clone https://github.com/KGaston0/ForgeLink.git  
   cd ForgeLink
```  

2. Create a virtual environment and activate it  
```bash
   python -m venv venv  
   source venv/bin/activate  
   (On Windows: venv\Scripts\activate)
```
3. Install dependencies  
```bash
   pip install -r requirements.txt  
```
4. Create environment variables  
```bash
   cp .env.example .env  
```

   Example `.env` configuration:  
```bash
   DEBUG=True  
   SECRET_KEY=change-me  
   DB_NAME=forgelink_db  
   DB_USER=forgelink_user  
   DB_PASSWORD=strongpassword  
   DB_HOST=localhost  
   DB_PORT=5432  
   CORS_ALLOW_ALL_ORIGINS=True  
```

5. PostgreSQL setup  
```bash
   createdb forgelink_db  
   createuser forgelink_user  
```

   SQL:
```bash
   ALTER USER forgelink_user WITH PASSWORD 'strongpassword';  
   GRANT ALL PRIVILEGES ON DATABASE forgelink_db TO forgelink_user;  
```

6. Run migrations  
```bash
   python manage.py migrate  
```
7. Create a superuser
```bash
   python manage.py createsuperuser  
```

8. Run the development server
```bash
   python manage.py runserver  
```

The API will be available at:  
- ✅ DELETE /api/graphs/{id}/ — Delete graph
- ✅ GET /api/graphs/{id}/canvas/ — Get graph canvas data (nodes + connections)

### Graph Nodes (Full CRUD ✅)

- ✅ GET /api/graph-nodes/ — List nodes within graphs
- ✅ POST /api/graph-nodes/ — Add a node to a graph with position/color
- ✅ GET /api/graph-nodes/{id}/ — Get specific graph node
- ✅ PUT /api/graph-nodes/{id}/ — Update graph node (full)
- ✅ PATCH /api/graph-nodes/{id}/ — Update graph node (partial)
- ✅ DELETE /api/graph-nodes/{id}/ — Remove node from graph

### Nodes (Full CRUD ✅)

- ✅ GET /api/nodes/ — List all nodes
- ✅ POST /api/nodes/ — Create a new node
- ✅ GET /api/nodes/{id}/ — Get specific node
- ✅ PUT /api/nodes/{id}/ — Update node (full)
- ✅ PATCH /api/nodes/{id}/ — Update node (partial)
- ✅ DELETE /api/nodes/{id}/ — Delete node
- ✅ GET /api/nodes/{id}/children/ — Get child nodes
- ✅ GET /api/nodes/{id}/connections/ — Get all connections for a node

### Connection Types (Full CRUD ✅)

- ✅ GET /api/connection-types/ — List connection types (filterable by project)
- ✅ POST /api/connection-types/ — Create connection type
- ✅ GET /api/connection-types/{id}/ — Get specific connection type
- ✅ PUT /api/connection-types/{id}/ — Update connection type (full)
- ✅ PATCH /api/connection-types/{id}/ — Update connection type (partial)
- ✅ DELETE /api/connection-types/{id}/ — Delete connection type

### Node Connections (Full CRUD ✅)

- ✅ GET /api/connections/ — List all connections
- ✅ POST /api/connections/ — Create a new connection
- ✅ GET /api/connections/{id}/ — Get specific connection
- ✅ PUT /api/connections/{id}/ — Update connection (full)
- ✅ PATCH /api/connections/{id}/ — Update connection (partial)
- ✅ DELETE /api/connections/{id}/ — Delete connection

### Query Parameters (Available on list endpoints)

- ✅ `?project={id}` — Filter by project
- ✅ `?graph={id}` — Filter by graph
- ✅ `?search={query}` — Search in specified fields
- ✅ `?ordering={field}` — Order results (use `-field` for descending)
- ✅ `?page={number}` — Pagination (100 items per page)

---

## TODO / Future Endpoints

These endpoints could be added in future iterations:

- ⏳ GET /api/projects/{id}/graphs/ — Get all graphs for a project
- ⏳ GET /api/graphs/{id}/statistics/ — Get graph statistics (node count, connection count, etc.)
- ⏳ POST /api/nodes/{id}/duplicate/ — Duplicate a node
- ⏳ GET /api/nodes/{id}/descendants/ — Get all descendants (recursive children)
- ⏳ GET /api/nodes/{id}/ancestors/ — Get all ancestors (recursive parents)
- ⏳ POST /api/graphs/{id}/export/ — Export graph data
- ⏳ POST /api/graphs/{id}/import/ — Import graph data
- ⏳ GET /api/connections/validate/ — Validate connection before creating
- ⏳ POST /api/projects/{id}/clone/ — Clone entire project

---

## Models (actualizado)

### Project

- name — Project name
- description — Project description
- owner — User who owns the project
- created_at — Timestamp
- updated_at — Timestamp

### Node

- project — Related project
- title — Node title
- node_type — character, location, event, item, concept, note
- content — Node content / description
- created_at — Timestamp
- updated_at — Timestamp

### Graph

- project — Related project
- name — Graph name
- created_at — Timestamp
- updated_at — Timestamp

### GraphNode

- graph — Related graph
- node — Related node
- position_x / position_y — Canvas position
- color — Visual color (hex)

### NodeConnection

- graph — Related graph

## Security Recommendations

**For production deployment:**

- ✅ JWT authentication with httpOnly cookies (implemented)
- ✅ XSS protection headers configured
- Disable CORS_ALLOW_ALL_ORIGINS and whitelist origins
- Generate a secure production SECRET_KEY
- Never commit real credentials
- Use strong database passwords and backups
- Set DEBUG=False
- Enable HTTPS and configure ALLOWED_HOSTS

---

## Roadmap

### Backend
- [x] API REST completa con Django REST Framework
- [x] Modelos: Projects, Nodes, Graphs, Connections
- [x] CRUD completo para todos los modelos
- [x] JWT authentication con httpOnly cookies
- [x] Custom User model
- [x] Security headers (XSS protection)
- [ ] User-based permissions
- [ ] Graph validation rules
- [ ] Versioning and history
- [ ] Realtime collaboration (WebSockets)

### Frontend
- [x] Landing page completa (11 componentes modulares)
- [x] Design system con dark/light mode
- [x] Arquitectura de componentes reutilizables
- [x] Sistema de autenticación (JWT)
- [x] Login/Register pages con validación completa
- [x] Protected routes y AuthContext
- [x] LoadingSpinner y manejo de estados
- [ ] Dashboard principal
- [ ] Editor visual de grafos (canvas interactivo)
- [ ] CRUD de nodos y conexiones
- [ ] Gestión de proyectos
- [ ] Colaboración en tiempo real
- [ ] Export/Import de datos
- [ ] Tests unitarios
- [ ] Storybook de componentes

### DevOps
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring y analytics

---

## License

This project is licensed under the MIT License.
