# ForgeLink

A graph-based knowledge management app for worldbuilding, story design and other creative projects. Model your material as typed nodes on visual canvases, connect them with typed relationships, and keep every project isolated.

- **Backend:** Django 4.2 + Django REST Framework, JWT in httpOnly cookies
- **Frontend:** React 19, Vite 7, Tailwind CSS v4, shadcn/ui, @xyflow/react
- **Database:** SQLite for development, PostgreSQL for production

## Features

- **Projects and graphs:** a project holds any number of graphs (canvases). Each user only sees their own data.
- **Nodes shared across graphs:** a node belongs to a project and can appear in several graphs, with a different position and color in each.
- **Frames and drill-down:** frames contain other nodes. Double-click a frame to enter it, and use the sidebar explorer to jump anywhere in the hierarchy.
- **Portals:** link one graph to another inside the same project.
- **Node Lab:** define your own node types (blueprints) with a property schema and group them in lists.
- **Typed connections:** per-project connection types with color, label and direction (forward, reverse, bidirectional, undirected).
- **Editor:** auto-save, undo/redo, light and dark theme, English and Spanish interface.

## Quick start

Requirements: Python 3.10+ and Node.js 18+.

```bash
git clone https://github.com/KGaston0/ForgeLink.git
cd ForgeLink

# Backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver         # http://localhost:8000

# Frontend (second terminal)
cd frontend
npm install
npm run dev                        # http://localhost:5173
```

Open http://localhost:5173 and register an account. A starter project and graph are created for every new user.

Both `.env` files are optional for local development. Copy `.env.example` (and `frontend/.env.example`) only if you want to change a setting such as the database or the API URL. `./dev.sh` starts both servers in tmux, and `python manage.py createsuperuser` creates an admin for http://localhost:8000/admin/.

## Useful addresses (development)

| What | URL |
|---|---|
| App | http://localhost:5173 |
| API | http://localhost:8000/api/ |
| Interactive API reference | http://localhost:8000/api/docs/ |
| OpenAPI schema | http://localhost:8000/api/schema/ |
| Django admin | http://localhost:8000/admin/ |

The API reference is generated from the code, so it is always current. It is only served when `DEBUG=True`.

## Checks

```bash
python manage.py test              # backend tests
cd frontend && npm run lint && npm run build
```

The same checks run in GitHub Actions on every push and pull request.

## Documentation

| Document | Contents |
|---|---|
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Architecture, data model, authentication, canvas and drill-down internals, workflows |
| [frontend/README.md](./frontend/README.md) | Frontend structure, routes, design system, conventions |
| [AGENTS.md](./AGENTS.md) | Project rules for AI coding assistants (Spanish) |

## License

MIT. See [LICENSE](./LICENSE).
