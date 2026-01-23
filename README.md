# ForgeLink

Django backend for a node-based project management and worldbuilding application.

ForgeLink provides a system for modeling knowledge as graphs, with isolated projects, typed relationships, and evolution over time. Suitable for worldbuilding, story design, and complex knowledge systems.

---

## Features

- Django REST Framework API for managing projects, nodes, and connections
- PostgreSQL database support
- Node-based graph structure for flexible project organization
- Multiple node types: characters, locations, events, items, concepts, and notes
- Node connections with various relationship types
- Project-scoped isolation
- CORS support for frontend integration
- Extensible architecture for future authentication, permissions, and realtime features

---

## Tech Stack

### Backend
- Language: Python 3.10+
- Framework: Django 4.2+
- API: Django REST Framework
- Database: PostgreSQL
- Libraries:
  - django-cors-headers
  - django-filter
  - python-decouple
  - djangorestframework-simplejwt

### Frontend (React - In Development)
- Framework: React 18+
- Language: JavaScript/TypeScript
- Router: React Router v6
- State Management: Context API / Zustand
- HTTP Client: Axios
- Styling: TailwindCSS / Material-UI (TBD)
- Graph Visualization: React Flow / D3.js (TBD)

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
http://localhost:8000/api/

---

## URL Structure

After starting the server, you can access:

| Path | Description |
|------|-------------|
| `http://localhost:8000/` | Redirects to API root |
| `http://localhost:8000/api/` | **API Root** - Django REST Framework browsable interface |
| `http://localhost:8000/mvp/` | **MVP Frontend** - Development/testing UI (legacy) |
| `http://localhost:8000/admin/` | **Django Admin** - Administration interface |
| `http://localhost:3000/` | **React Frontend** - Main application (when running) |
| `http://localhost:8000/admin/` | **Django Admin** - Model management interface |

> 📘 **For detailed API documentation**, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

## API Endpoints

Base URL:
http://localhost:8000/api/

> **Legend:** ✅ Implemented | ⏳ To be implemented

### Authentication

- ✅ POST /api/auth/jwt/login/ — Obtain JWT tokens
- ✅ POST /api/auth/jwt/refresh/ — Refresh access token
- ✅ GET /api/auth/me/ — Get current user info

### Projects (Full CRUD ✅)

- ✅ GET /api/projects/ — List all projects
- ✅ POST /api/projects/ — Create a new project
- ✅ GET /api/projects/{id}/ — Retrieve project details
- ✅ PUT /api/projects/{id}/ — Update project (full)
- ✅ PATCH /api/projects/{id}/ — Update project (partial)
- ✅ DELETE /api/projects/{id}/ — Delete project
- ✅ GET /api/projects/{id}/nodes/ — Get all nodes for a project
- ✅ GET /api/projects/{id}/connections/ — Get all connections for a project

### Graphs (Full CRUD ✅)

- ✅ GET /api/graphs/ — List graphs
- ✅ POST /api/graphs/ — Create graph
- ✅ GET /api/graphs/{id}/ — Graph details
- ✅ PUT /api/graphs/{id}/ — Update graph (full)
- ✅ PATCH /api/graphs/{id}/ — Update graph (partial)
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

### GraphNode (nuevo)

- graph — Related graph
- node — Related node
- position_x / position_y — Canvas position (por grafo)
- color — Visual color (hex)

### NodeConnection (actualizado)

- graph — Related graph
- source_node / target_node — Nodes (del mismo project del graph)
- connection_type — Project-scoped type
- label — Optional connection label
- created_at — Timestamp

---

## Development

Running tests:  
python manage.py test  

Admin panel:  
http://localhost:8000/admin/  

Browsable API:  
http://localhost:8000/api/  

---

## Security Considerations

Important: development-only setup.

Before deploying to production:

- Implement authentication (JWT, tokens, OAuth)
- Replace AllowAny permissions with proper access control
- Disable CORS_ALLOW_ALL_ORIGINS and whitelist origins
- Generate a secure production SECRET_KEY
- Never commit real credentials
- Use strong database passwords and backups
- Set DEBUG=False
- Enable HTTPS and configure ALLOWED_HOSTS

---

## Roadmap

- ✅ JWT authentication
- ✅ User-based permissions
- ✅ Project structure reorganization (apps/ folder)
- ✅ Frontend structure setup (React)
- ⏳ Frontend implementation (React components)
- ⏳ Graph visualization with React Flow
- 🔮 Realtime collaboration (WebSockets)
- 🔮 Graph validation rules
- 🔮 Versioning and history
- 🔮 Advanced search and filtering

**Legend**: ✅ Complete | ⏳ In Progress | 🔮 Planned

---

## Frontend Development

The React frontend is located in the `/frontend` directory with a well-organized structure following modern best practices.

### Quick Start

```bash
cd frontend

# Install dependencies (first time)
npm install

# Start development server
npm start
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components (routes)
│   ├── features/      # Feature modules (auth, projects, graphs, etc.)
│   ├── services/      # API client and services
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React Context providers
│   ├── utils/         # Utility functions
│   └── styles/        # Global styles and themes
├── public/            # Static files
└── tests/             # Test files
```

For detailed frontend documentation, see:
- [Frontend README](./frontend/README.md)
- [Frontend Structure Guide](./frontend/STRUCTURE.md)
- [Components Guide](./frontend/src/components/README.md)
- [Features Guide](./frontend/src/features/README.md)

---

## License

This project is licensed under the MIT License.
