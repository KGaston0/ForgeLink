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

- Language: Python 3.10+
- Backend:
  - Django 4.2+
  - Django REST Framework
- Database: PostgreSQL
- Libraries:
  - django-cors-headers
  - django-filter
  - python-dotenv

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

## API Endpoints

Base URL:
http://localhost:8000/api/

### Graphs (nuevo)

- GET /api/graphs/ — Listar grafos
- POST /api/graphs/ — Crear grafo
- GET /api/graphs/{id}/ — Detalle
- GET /api/graphs/{id}/canvas/ — (Conveniencia) Devuelve nodos+conexiones del grafo en una sola respuesta

### Graph Nodes (layout por grafo)

- GET /api/graph-nodes/ — Listar nodos dentro de grafos
- POST /api/graph-nodes/ — Agregar un node a un grafo con posición/color

### Connection Types (nuevo)

- GET /api/connection-types/ — Listar tipos (filtrable por project)
- POST /api/connection-types/ — Crear tipo

### Node Connections

- GET /api/connections/ — List all connections
- POST /api/connections/ — Create a new connection

Query parameters:
- graph — Filter by graph
- source_node — Filter by source node
- target_node — Filter by target node
- connection_type — Filter by connection type

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

- JWT authentication
- User-based permissions
- Realtime collaboration (WebSockets)
- Graph validation rules
- Versioning and history
- Frontend integration (React or Vue)

---

## License

This project is licensed under the MIT License.
