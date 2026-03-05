# ForgeLink API Reference

Base URL: `http://localhost:8000/api/`

All endpoints require authentication unless noted. Authentication is via JWT tokens stored in httpOnly cookies.

---

## Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/jwt/login/` | Obtain JWT tokens (set as httpOnly cookie) | No |
| POST | `/auth/jwt/refresh/` | Refresh access token | No |
| POST | `/auth/jwt/logout/` | Logout and blacklist token | Yes |
| GET | `/auth/me/` | Current authenticated user info | Yes |

**Login request:**
```json
{ "username": "...", "password": "..." }
```

**Login response:** Sets `access` and `refresh` tokens as httpOnly cookies. Response body:
```json
{ "access": "...", "refresh": "..." }
```

---

## Users

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/` | Register a new user |
| GET | `/users/me/` | Current user profile |

**Register request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "SecureP@ss1"
}
```

> On registration, a signal automatically creates an initial project ("Mi Primer Proyecto") and graph ("Grafo Principal").

---

## Projects

Lookup by **UUID**. All operations are scoped to the authenticated user's projects.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/` | List user's projects |
| POST | `/projects/` | Create project |
| GET | `/projects/{uuid}/` | Project detail |
| PATCH | `/projects/{uuid}/` | Update project |
| DELETE | `/projects/{uuid}/` | Delete project (cascades to all graphs, nodes, connections) |
| GET | `/projects/recent/` | Last 3 recently updated projects |
| GET | `/projects/{uuid}/nodes/` | All nodes in the project |
| GET | `/projects/{uuid}/connections/` | All connections across project graphs |

**Create/Update request:**
```json
{ "name": "My Project", "description": "Optional description" }
```

**Response includes:**
```json
{
  "id": 1,
  "uuid": "b18c9fed-bba9-4343-b325-ef651da8a6dd",
  "name": "My Project",
  "description": "...",
  "owner": 1,
  "node_count": 12,
  "graph_count": 3,
  "created_at": "...",
  "updated_at": "..."
}
```

**Query parameters:**
- `?search=term` — Search by name or description
- `?ordering=field` — Order by `created_at`, `updated_at`, `name` (prefix `-` for descending)

---

## Graphs

Lookup by **UUID**. Filtered to graphs belonging to the authenticated user's projects.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/graphs/` | List graphs |
| POST | `/graphs/` | Create graph |
| GET | `/graphs/{uuid}/` | Graph detail |
| PATCH | `/graphs/{uuid}/` | Update graph |
| DELETE | `/graphs/{uuid}/` | Delete graph |
| GET | `/graphs/{uuid}/canvas/` | Full canvas data (graph info + nodes + connections) |
| PUT | `/graphs/{uuid}/canvas/bulk/` | Bulk save entire canvas state |

**Create request:**
```json
{ "project": 1, "name": "Main Graph", "description": "..." }
```

> The `project` field expects the internal integer ID (returned as `id` in project responses).

**Canvas response** (`GET /graphs/{uuid}/canvas/`):
```json
{
  "graph": { "id": 1, "uuid": "...", "project": 1, "name": "...", ... },
  "nodes": [
    {
      "id": 1, "graph": 1, "node": 1,
      "position_x": 100, "position_y": 200,
      "color": "#3B82F6", "is_frame": false,
      "width": 160, "height": 80,
      "node_title": "Character A", "node_type": "character",
      "node_custom_properties": {}
    }
  ],
  "connections": [
    {
      "id": 1, "graph": 1,
      "source_node": 1, "target_node": 2,
      "connection_type": 1,
      "label": "knows", "direction": "forward"
    }
  ]
}
```

**Bulk save request** (`PUT /graphs/{uuid}/canvas/bulk/`):
```json
{
  "nodes": [
    {
      "temp_id": "gn-1",
      "graph_node_id": 1,
      "node_id": 1,
      "node_type": "character",
      "label": "Character A",
      "position_x": 150, "position_y": 250,
      "is_frame": false,
      "width": 160, "height": 80,
      "parent_node": null,
      "custom_properties": {}
    }
  ],
  "connections": [
    {
      "connection_id": 1,
      "source_temp_id": "gn-1",
      "target_temp_id": "gn-2",
      "connection_type_id": 1,
      "label": "knows",
      "direction": "forward"
    }
  ]
}
```

**Query parameters:**
- `?project=id` — Filter by project (internal ID)
- `?project__uuid=uuid` — Filter by project UUID
- `?search=term` — Search by name or description
- `?ordering=field` — Order by `created_at`, `updated_at`, `name`

---

## Nodes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/nodes/` | List nodes |
| POST | `/nodes/` | Create node |
| GET | `/nodes/{id}/` | Node detail |
| PATCH | `/nodes/{id}/` | Update node |
| DELETE | `/nodes/{id}/` | Delete node |
| GET | `/nodes/{id}/children/` | Child nodes (hierarchy) |
| GET | `/nodes/{id}/connections/` | All connections involving this node |

**Create request:**
```json
{
  "project": 1,
  "title": "Character A",
  "node_type": "character",
  "content": "Description text",
  "custom_properties": { "age": 25 },
  "parent_node": null
}
```

**Node types:** `character`, `location`, `event`, `item`, `concept`, `note`, `frame`

**Query parameters:**
- `?project=id` — Filter by project
- `?node_type=character` — Filter by type
- `?search=term` — Search by title or content

---

## Graph Nodes

Junction table managing node membership and visual layout within a graph.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/graph-nodes/` | List graph-node memberships |
| POST | `/graph-nodes/` | Add node to a graph with position |
| GET | `/graph-nodes/{id}/` | Graph-node detail |
| PATCH | `/graph-nodes/{id}/` | Update position, color, frame data |
| DELETE | `/graph-nodes/{id}/` | Remove node from graph |

**Create request:**
```json
{
  "graph": 1,
  "node": 1,
  "position_x": 100, "position_y": 200,
  "color": "#3B82F6",
  "is_frame": false,
  "width": 160, "height": 80,
  "parent_node": null
}
```

**Query parameters:**
- `?graph=id` — Filter by graph
- `?node=id` — Filter by node

---

## Connection Types

Project-scoped relationship types. A default "Default" type is auto-created when needed.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/connection-types/` | List connection types |
| POST | `/connection-types/` | Create type |
| GET | `/connection-types/{id}/` | Type detail |
| PATCH | `/connection-types/{id}/` | Update type |
| DELETE | `/connection-types/{id}/` | Delete type (fails if connections exist) |

**Create request:**
```json
{ "project": 1, "name": "Knows", "description": "...", "color": "#6B7280" }
```

**Query parameters:**
- `?project=id` — Filter by project

---

## Connections

Graph-scoped relationships between nodes.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/connections/` | List connections |
| POST | `/connections/` | Create connection |
| GET | `/connections/{id}/` | Connection detail |
| PATCH | `/connections/{id}/` | Update connection |
| DELETE | `/connections/{id}/` | Delete connection |

**Create request:**
```json
{
  "graph": 1,
  "source_node": 1,
  "target_node": 2,
  "connection_type": 1,
  "label": "knows",
  "direction": "forward",
  "source_handle_position": null,
  "target_handle_position": null
}
```

**Direction options:** `forward`, `reverse`, `bidirectional`, `undirected`

**Query parameters:**
- `?graph=id` — Filter by graph
- `?source_node=id` — Filter by source
- `?target_node=id` — Filter by target
- `?connection_type=id` — Filter by type

---

## Common Notes

- All list endpoints support pagination (100 items per page)
- All timestamps are ISO 8601 in UTC
- All POST/PATCH requests use `Content-Type: application/json`
- Projects and Graphs use UUID for URL lookup; all other resources use integer IDs
- Owner-scoped: users can only access their own data
