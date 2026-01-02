# ForgeLink

Django backend for a node-based project management and worldbuilding application.

## Features

- **Django REST Framework API** for managing projects, nodes, and connections
- **PostgreSQL** database support
- **Node-based graph structure** for flexible project organization
- **Multiple node types**: characters, locations, events, items, concepts, and notes
- **Node connections** with various relationship types
- **CORS support** for frontend integration

## Tech Stack

- Django 4.2+
- Django REST Framework
- PostgreSQL
- django-cors-headers
- django-filter

## Installation

1. Clone the repository:
```bash
git clone https://github.com/KGaston0/ForgeLink.git
cd ForgeLink
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Set up PostgreSQL database:
```bash
# Create a PostgreSQL database and user
createdb forgelink_db
createuser forgelink_user
# Grant privileges to the user on the database
```

6. Update `.env` with your database credentials.

7. Run migrations:
```bash
python manage.py migrate
```

8. Create a superuser:
```bash
python manage.py createsuperuser
```

9. Run the development server:
```bash
python manage.py runserver
```

## API Endpoints

The API is available at `http://localhost:8000/api/`

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create a new project
- `GET /api/projects/{id}/` - Get project details
- `PUT/PATCH /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `GET /api/projects/{id}/nodes/` - Get all nodes in a project
- `GET /api/projects/{id}/connections/` - Get all connections in a project

### Nodes
- `GET /api/nodes/` - List all nodes
- `POST /api/nodes/` - Create a new node
- `GET /api/nodes/{id}/` - Get node details
- `PUT/PATCH /api/nodes/{id}/` - Update node
- `DELETE /api/nodes/{id}/` - Delete node

Query parameters:
- `?project={id}` - Filter by project
- `?node_type={type}` - Filter by node type
- `?search={query}` - Search in title and content

### Node Connections
- `GET /api/connections/` - List all connections
- `POST /api/connections/` - Create a new connection
- `GET /api/connections/{id}/` - Get connection details
- `PUT/PATCH /api/connections/{id}/` - Update connection
- `DELETE /api/connections/{id}/` - Delete connection

Query parameters:
- `?project={id}` - Filter by project
- `?source_node={id}` - Filter by source node
- `?target_node={id}` - Filter by target node
- `?connection_type={type}` - Filter by connection type

## Models

### Project
- `name` - Project name
- `description` - Project description
- `owner` - User who owns the project
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Node
- `project` - Related project
- `title` - Node title
- `node_type` - Type (character, location, event, item, concept, note)
- `content` - Node content/description
- `position_x`, `position_y` - Canvas position
- `color` - Visual color (hex code)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### NodeConnection
- `project` - Related project
- `source_node` - Starting node
- `target_node` - Ending node
- `connection_type` - Relationship type
- `label` - Optional connection label
- `created_at` - Timestamp

## Development

### Running Tests
```bash
python manage.py test
```

### Admin Panel
Access the admin panel at `http://localhost:8000/admin/` with your superuser credentials.

### Browsable API
The Django REST Framework provides a browsable API interface at `http://localhost:8000/api/`

## Security Considerations

⚠️ **Important**: This is a development scaffolding setup. Before deploying to production:

1. **Authentication & Authorization**:
   - Current setup uses `AllowAny` permissions for all API endpoints
   - Implement proper authentication (e.g., Token Authentication, JWT, OAuth)
   - Add appropriate permission classes to protect endpoints
   - Example: Change `DEFAULT_PERMISSION_CLASSES` in `settings.py` to `['rest_framework.permissions.IsAuthenticated']`

2. **CORS Configuration**:
   - `CORS_ALLOW_ALL_ORIGINS=True` allows any website to access your API
   - For production, set `CORS_ALLOW_ALL_ORIGINS=False`
   - Specify only trusted origins in `CORS_ALLOWED_ORIGINS`

3. **Secret Key**:
   - Generate a new, unique `SECRET_KEY` for production
   - Never commit the `.env` file with real credentials

4. **Database**:
   - Use strong passwords for the PostgreSQL user
   - Configure proper database backups

5. **DEBUG Mode**:
   - Set `DEBUG=False` in production to prevent information disclosure

6. **HTTPS**:
   - Use HTTPS in production to encrypt data in transit
   - Update `ALLOWED_HOSTS` with your production domain

## License

This project is licensed under the MIT License.
