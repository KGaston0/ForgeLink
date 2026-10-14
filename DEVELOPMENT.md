# ForgeLink — Development Guide

How the system works and how to work on it. For setup see the [README](./README.md); for the frontend layout and design system see [frontend/README.md](./frontend/README.md). Endpoint details live in the generated API reference at http://localhost:8000/api/docs/ (development only).

---

## Repository layout

```
forgelink_backend/   Django project: settings, root URLs, JWT cookie auth, serializer mixins
apps/
  users/             Custom User model (AbstractUser + membership fields)
  projects/          Project + signal that creates a starter project for new users
  nodes/             Node, NodeBlueprint, BlueprintList
  graphs/            Graph, GraphNode, canvas endpoints
  connections/       ConnectionType, NodeConnection
frontend/            React SPA
.github/workflows/   CI
```

---

## Data model

```
User
 ├── NodeBlueprint  (creator)            reusable node templates
 ├── BlueprintList  (creator)            groups of blueprints
 └── Project (uuid)
      ├── Node                           entity that lives in the project
      ├── ConnectionType                 relationship kind, per project
      └── Graph (uuid)                   one canvas
           ├── GraphNode                 a Node placed on this canvas
           └── NodeConnection            link between two Nodes, scoped to this canvas
```

A node belongs to a project and can be placed on several graphs, once per graph. Position, color, size and nesting are stored per placement (`GraphNode`), not on the node.

### Users
`membership_type` (`free`, `basic`, `premium`, `enterprise`), `membership_start_date`, `membership_end_date`, `phone_number`, `bio`, `avatar_url`, `email_verified`.

### Project
`uuid` (public identifier), `name`, `description`, `owner` (CASCADE). Ordered by `-updated_at`.

### Node
| Field | Notes |
|---|---|
| `project` | CASCADE |
| `blueprint` | FK to NodeBlueprint, SET_NULL |
| `node_type` | free text, default `note` (for example `character`, `Dragon`, `portal`) |
| `title`, `content` | |
| `custom_properties` | JSON, free-form properties |

### NodeBlueprint and BlueprintList
A blueprint is a user-defined node type: `name`, `description`, `category`, `is_frame`, `color`, `schema` (JSON property rules), `is_published`, owned by `creator`. A `BlueprintList` groups blueprints (many-to-many) for organization.

### Graph
`uuid`, `project`, `name` (unique per project), `description`.

### GraphNode
| Field | Notes |
|---|---|
| `graph`, `node` | unique together; the node must belong to the graph's project |
| `position_x`, `position_y`, `color` | layout |
| `is_frame`, `width`, `height` | frame nodes contain other nodes (defaults 400 x 300) |
| `parent_node` | self FK to the containing frame, CASCADE. Must be in the same graph; cycles are rejected |

The canvas nests nodes through `GraphNode.parent_node`. Nesting is a property of a placement on one graph, not of the node, so a node can sit inside a frame on one graph and at the top level on another.

### ConnectionType
`project`, `name` (unique per project), `description`, `color`.

### NodeConnection
| Field | Notes |
|---|---|
| `graph`, `source_node`, `target_node`, `connection_type` | unique together; deleting a connection type deletes its connections |
| `label` | optional |
| `direction` | `forward`, `reverse`, `bidirectional`, `undirected` |
| `source_handle_position`, `target_handle_position` | nullable float, position of the edge anchor on the node |

Validation: no self-connections; nodes and connection type must belong to the graph's project; both nodes must be placed on the graph.

---

## Backend

### Identifiers
Projects and graphs are addressed by `uuid` in URLs (`lookup_field = 'uuid'`). Everything else uses the integer `id`. Related objects are always referenced by integer id in request bodies, including `project` when creating a graph.

### Ownership
Every queryset is filtered to the requesting user (`project__owner`, `graph__project__owner`, `creator`). Writes are protected the same way: serializers that accept a foreign key use `OwnerScopedRelatedFieldsMixin` ([serializer_mixins.py](./forgelink_backend/serializer_mixins.py)) so only objects the user owns are accepted. New serializers with related fields must declare `owner_scoped_fields`. Cross-user tests are in [apps/projects/test_isolation.py](./apps/projects/test_isolation.py).

### Authentication
- `POST /api/auth/jwt/login/` validates the credentials and sets two httpOnly cookies, `access_token` (30 minutes) and `refresh_token` (7 days). The body is only `{"detail": "Login successful"}`.
- `JWTCookieAuthentication` reads the access token from the `Authorization` header first and from the cookie second.
- `POST /api/auth/jwt/refresh/` reads the refresh token from its cookie and sets new cookies. Refresh tokens rotate, and the previous one is blacklisted.
- `POST /api/auth/jwt/logout/` blacklists the refresh token and clears both cookies. It accepts unauthenticated calls so an expired session can still clear its cookies.
- `GET /api/auth/me/` answers 200 with `{"authenticated": false}` when there is no token and `{"authenticated": true, "user": {...}}` with a valid one. An invalid or expired access token returns 401, which makes the frontend refresh it.
- `POST /api/users/` registers a user (public). A `post_save` signal ([apps/projects/signals.py](./apps/projects/signals.py)) creates a starter project and graph for each new user.

### Settings
Read from the environment or `.env` with python-decouple.

| Variable | Default | Purpose |
|---|---|---|
| `SECRET_KEY` | insecure dev key | Required when `DEBUG` is false |
| `DEBUG` | `True` | Also enables `/api/docs/` and `/api/schema/` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | |
| `DB_ENGINE` | `sqlite3` | Any other value selects PostgreSQL |
| `DB_NAME` | `db.sqlite3` (SQLite) / `forgelink_db` | |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | | PostgreSQL only |
| `CORS_ALLOW_ALL_ORIGINS` | `False` | Keep false: credentials are sent with cookies |
| `CORS_ALLOWED_ORIGINS` | Vite dev origins | Frontend origins |
| `CSRF_TRUSTED_ORIGINS` | Vite and Django dev origins | |
| `JWT_COOKIE_SECURE` | `False` | Set `True` behind HTTPS |
| `JWT_COOKIE_SAMESITE` | `Lax` | |

### Removing a node from a graph

`DELETE /api/graph-nodes/{id}/` removes the placement and everything nested inside it (a frame's contents), plus the connections of that graph that touch any of them. A `Node` is deleted as well, but only when it no longer has a placement on any graph; a node that also appears on another graph stays in the project and on that graph. Deleting a whole graph removes its placements and connections and leaves the project's nodes in place.

### Canvas endpoints

`GET /api/graphs/{uuid}/canvas/` returns everything the editor needs for one level of the graph.

Query parameters: `folder_id` (GraphNode id of the frame to show; omit for the root level) and `depth` (levels of nesting to include, default 3, `-1` for all).

Response:

| Key | Contents |
|---|---|
| `graph` | the graph |
| `current_folder` | the frame being viewed, or `null` at the root |
| `nodes` | visible GraphNodes with layout, plus `hidden_children_count` for descendants beyond `depth` |
| `connections` | connections between visible nodes |
| `hierarchy` | flat list of every GraphNode (`id`, `name`, `parent_id`, `is_frame`), used for the sidebar explorer |

Edge hoisting: a connection whose endpoint is hidden inside a frame is re-routed to the nearest visible ancestor, flagged `is_hoisted: true`, and its handle positions are cleared for that end. Connections that would loop onto the same visible node are omitted.

`PUT /api/graphs/{uuid}/canvas/bulk/` saves the whole canvas in one transaction. Body:

```json
{
  "nodes": [
    {
      "temp_id": "temp-1",
      "graph_node_id": null,
      "node_type": "character",
      "label": "Aria",
      "position_x": 100, "position_y": 200,
      "is_frame": false, "width": 160, "height": 80,
      "parent_node": null,
      "blueprint_id": null,
      "custom_properties": {}
    }
  ],
  "connections": [
    {
      "connection_id": null,
      "source_temp_id": "temp-1",
      "target_temp_id": "gn-7",
      "connection_type_id": 1,
      "label": "", "direction": "forward",
      "source_handle_position": null, "target_handle_position": null
    }
  ]
}
```

- `graph_node_id` null creates a node and its placement; an existing id updates it. The same holds for `connection_id`.
- Nodes are referenced as `temp-*` (created in this request) or `gn-<id>` (existing GraphNode of this graph). `parent_node` accepts the same references.
- The response lists created nodes as `{temp_id, node_id, graph_node_id}` so the client can replace its temporary ids.
- Blueprints and connection types must belong to the user and project; otherwise the request fails with 400 and nothing is saved.
- Hoisted connections (`is_hoisted: true`) keep their original endpoints.

---

## Frontend internals

### Authentication flow
1. `authService.login` posts credentials; the cookies are set by the backend.
2. `AuthContext` calls `/auth/me/` on load and trusts the `authenticated` flag.
3. `apiClient` (axios, `withCredentials`) catches a 401, calls the refresh endpoint once (concurrent requests share the same refresh) and retries the request. Login, refresh and logout are never retried. If the refresh fails it throws `AuthenticationError`, and `AuthContext` clears the user and redirects to `/login`.
4. `ProtectedRoute` redirects unauthenticated visitors to `/login`.

### Graph editor
```
GraphCanvasPage
  └── GraphCanvas  (ReactFlowProvider)
       └── GraphCanvasInner
            ├── ReactFlow with custom node types (standard, frame, portal) and edge type
            ├── Toolbar
            ├── NodeEditorModal / EdgeEditorModal / PortalCreationModal / NodeLabModal
            └── useUndoRedo
```

1. `fetchCanvasData(graphUuid, folderId, depth)` loads one level and maps it to React Flow nodes and edges.
2. Edits change local React Flow state and mark the canvas unsaved.
3. `saveCanvasBulk` runs 2.5 seconds after the last change.
4. The response maps temporary ids to real ones.

The URL carries the graph UUID. Foreign keys in payloads use the integer ids returned by the canvas response.

### Drill-down navigation
- The editor tracks `currentFolderId`. Double-clicking a frame (or a frame in the sidebar tree) sets it, and the canvas reloads showing only that frame's children.
- Pending changes are saved before the folder changes.
- Nodes created while inside a frame get that frame as their parent.
- A node is given a React Flow `parentId` only when its parent is in the visible set; otherwise it is placed at the top level of the view.
- Deleting a frame removes the placements nested inside it from the graph (CASCADE on `GraphNode.parent_node`); the underlying nodes stay in the project.

### Portals
A portal is a node with `node_type = 'portal'` and `custom_properties.target_graph_uuid`. Double-clicking it navigates to `/graphs/<target_graph_uuid>`. The creation modal lists the other graphs of the same project.

### Sidebar explorer
The sidebar shows the node tree of the current graph. It builds from `hierarchy` through `buildFrameTree` ([features/graphs/utils/buildFrameTree.js](./frontend/src/features/graphs/utils/buildFrameTree.js)) and refreshes when the canvas reloads, so nodes created since the last reload appear after the next load.

### Window events
Components that do not share a parent communicate through `window` custom events.

| Event | From | To | `detail` |
|---|---|---|---|
| `canvas-frames-updated` | GraphCanvas | Sidebar | tree of `{id, name, is_frame, children}` |
| `canvas-folder-changed` | GraphCanvas | Sidebar | current folder id (`null` at root) |
| `sidebar-navigate` | Sidebar | GraphCanvas | folder id to open |
| `canvas-unsaved` | node components | GraphCanvas | none; marks the canvas as having unsaved changes |

---

## Design notes

Why the system is built the way it is, where the code does not make it obvious.

- **Node and GraphNode are separate.** A `Node` holds what something is (title, type, properties). A `GraphNode` holds where it sits on one canvas (position, color, size, containing frame). Because `(graph, node)` is unique, the same node can appear on several graphs with different layouts and nesting, and rearranging a canvas never touches the project's data.
- **Node types are free text, not a fixed list.** The product is for worldbuilding, where the types are the user's own ("Dragon", "Spell"). Blueprints add a reusable template and property schema on top of a plain string.
- **Projects and graphs use UUIDs in URLs.** Sequential ids are not exposed in the address bar. Ids are still used inside request bodies, so ownership checks, not secrecy of the id, are what protect data (see Ownership).
- **Ownership is enforced in the serializers as well as the querysets.** Filtering a ViewSet queryset only hides other users' objects when reading. DRF accepts any primary key for a foreign key on write, so without `OwnerScopedRelatedFieldsMixin` a user could attach their data to someone else's project by guessing an id.
- **Tokens live in httpOnly cookies.** JavaScript cannot read them, which limits what an XSS can steal. The access token is short-lived (30 minutes), and refresh tokens rotate and are blacklisted after use, so a stolen refresh token stops working as soon as the legitimate one is used. Because cookies are sent automatically, CORS stays closed to unknown origins.
- **Concurrent refreshes share one request.** With rotation, two simultaneous refreshes would blacklist each other's token and log the user out, so the client sends a single refresh and every waiting request reuses it.
- **The canvas is saved in one transaction.** `canvas/bulk/` applies all node and connection changes atomically, with `bulk_create`/`bulk_update`, so a failed save never leaves half a canvas behind and large canvases stay fast. Temporary ids let the client create nodes and connect them in the same request.
- **The canvas loads one level at a time.** Large graphs would be slow to render and fetch whole, so `canvas/` returns a folder up to `depth` levels. The separate flat `hierarchy` list lets the sidebar show the full tree regardless of depth.
- **Edges are hoisted to the nearest visible ancestor.** When an edge's endpoint is inside a frame that is not expanded, drawing it to a missing node would break the edge, so it is drawn to the frame instead. Saving ignores the hoisted endpoints; otherwise saving would rewrite the real connection to point at the frame.
- **Drill-down replaces the canvas instead of zooming.** React Flow fails when a node's `parentId` is not in the node array. Loading only the current folder's children and treating them as top-level nodes avoids that. Pending changes are saved before the folder changes so nothing is lost on navigation.
- **The sidebar and the canvas talk through window events.** Each page renders `<Sidebar />` next to its content, so on the graph page the sidebar and the canvas are siblings and neither passes props to the other.
- **A starter project is created at registration.** So a new user can open a working canvas immediately.
- **SQLite by default, PostgreSQL for production.** Local setup needs no database server.

---

## Workflow

### Commands
```bash
# Backend
python manage.py runserver
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py test
python manage.py spectacular --validate      # check the OpenAPI schema

# Frontend (from frontend/)
npm run dev
npm run lint
npm run build
```

`./helpers.sh` wraps the common ones (`check`, `shell`, `migrations`, `test-backend`, `lint-all`, `create-user`, `reset-db`).

### Continuous integration
`.github/workflows/ci.yml` runs on pushes to `main` and `Dev` and on pull requests:
- Backend: `manage.py check`, `makemigrations --check`, `manage.py test`.
- Frontend: `npm ci`, `npm run lint`, `npm run build`.

### Database
SQLite works without configuration. For PostgreSQL set `DB_ENGINE=postgresql` and the `DB_*` variables in `.env`. After switching branches that change migrations, recreate the local SQLite file or run `migrate` on a fresh database.

### Adding a feature
1. Backend: model and migration, serializer (declare `owner_scoped_fields` for foreign keys), ViewSet filtered to the user, route, tests including a cross-user case.
2. Frontend: a complex feature goes in `features/<name>/` (`api/`, `components/`, `hooks/`); a simple page goes in `pages/<name>/`. Register routes in `App.jsx`.
3. Add every user-visible string to both `src/locales/en.json` and `src/locales/es.json`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Port 8000 or 5173 already in use | Stop the other process, or run on another port (`python manage.py runserver 8001`, `npm run dev -- --port 5174`) and add the new frontend origin to `CORS_ALLOWED_ORIGINS` |
| `no such column` or migration errors after switching branches | Delete the local SQLite file and run `python manage.py migrate` |
| Login works but every request returns 401 | Check that the browser origin is in `CORS_ALLOWED_ORIGINS` and that `VITE_API_URL` points to the running backend |
| `Module not found` in the frontend | Run `npm install` in `frontend/` |
| Frontend import of `@/lib/utils` fails | Make sure `frontend/src/lib/utils.js` exists (it must not be git-ignored) |
