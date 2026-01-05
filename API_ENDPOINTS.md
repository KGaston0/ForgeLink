# ForgeLink API Endpoints

## Base URL Structure

| Path | Purpose |
|------|---------|
| `/` | Redirects to `/api/` (DRF browsable API root) |
| `/api/` | API root - Django REST Framework browsable interface |
| `/mvp/` | MVP frontend (development/testing interface) |
| `/admin/` | Django admin interface |

---

## Authentication Endpoints

### JWT Authentication
- `POST /api/auth/jwt/login/` - Obtain JWT access and refresh tokens
  - Body: `{"username": "...", "password": "..."}`
  - Returns: `{"access": "...", "refresh": "..."}`

- `POST /api/auth/jwt/refresh/` - Refresh access token
  - Body: `{"refresh": "..."}`
  - Returns: `{"access": "..."}`

### User Info
- `GET /api/auth/me/` - Get current authenticated user info
  - Returns: `{"authenticated": true, "user": {"username": "..."}}`

---

## App Endpoints

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create a new project
- `GET /api/projects/{id}/` - Retrieve a specific project
- `PUT /api/projects/{id}/` - Update a project
- `DELETE /api/projects/{id}/` - Delete a project
- `GET /api/projects/{id}/nodes/` - Get all nodes for a project
- `GET /api/projects/{id}/connections/` - Get all connections for a project

### Graphs
- `GET /api/graphs/` - List all graphs
- `POST /api/graphs/` - Create a new graph
- `GET /api/graphs/{id}/` - Retrieve a specific graph
- `PUT /api/graphs/{id}/` - Update a graph
- `DELETE /api/graphs/{id}/` - Delete a graph
- `GET /api/graphs/{id}/canvas/` - Get graph canvas data (nodes + connections)

### Graph Nodes
- `GET /api/graph-nodes/` - List all graph nodes
- `POST /api/graph-nodes/` - Add a node to a graph
- `GET /api/graph-nodes/{id}/` - Retrieve a specific graph node
- `PUT /api/graph-nodes/{id}/` - Update graph node (position, color)
- `DELETE /api/graph-nodes/{id}/` - Remove node from graph

### Nodes
- `GET /api/nodes/` - List all nodes
- `POST /api/nodes/` - Create a new node
- `GET /api/nodes/{id}/` - Retrieve a specific node
- `PUT /api/nodes/{id}/` - Update a node
- `DELETE /api/nodes/{id}/` - Delete a node
- `GET /api/nodes/{id}/connections/` - Get all connections for a node

### Connection Types
- `GET /api/connection-types/` - List all connection types
- `POST /api/connection-types/` - Create a new connection type
- `GET /api/connection-types/{id}/` - Retrieve a connection type
- `PUT /api/connection-types/{id}/` - Update a connection type
- `DELETE /api/connection-types/{id}/` - Delete a connection type

### Connections
- `GET /api/connections/` - List all connections
- `POST /api/connections/` - Create a new connection
- `GET /api/connections/{id}/` - Retrieve a specific connection
- `PUT /api/connections/{id}/` - Update a connection
- `DELETE /api/connections/{id}/` - Delete a connection

---

## Common Query Parameters

- `?project={id}` - Filter by project
- `?graph={id}` - Filter by graph
- `?search={query}` - Search (available on most list endpoints)
- `?ordering={field}` - Order results (use `-field` for descending)
- `?page={number}` - Pagination

---

## Authentication

All API endpoints (except `/api/auth/jwt/login/` and `/api/auth/jwt/refresh/`) require authentication.

Add the JWT token to your requests:
```
Authorization: Bearer {access_token}
```

---

## Development

- **API Root**: Visit `http://localhost:8000/api/` for the browsable API
- **MVP Frontend**: Visit `http://localhost:8000/mvp/` for the development UI
- **Admin Panel**: Visit `http://localhost:8000/admin/` for Django admin

---

## Notes

- All timestamps are in UTC
- All POST/PUT requests require `Content-Type: application/json`
- All list endpoints support pagination (100 items per page by default)
- The API follows REST conventions (GET, POST, PUT, DELETE)

