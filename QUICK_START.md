# 🚀 Quick Start

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

---

## 1️⃣ Backend Setup

```bash
git clone https://github.com/KGaston0/ForgeLink.git
cd ForgeLink

# Create virtual environment and install dependencies
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env    # Edit .env with your settings if needed

# Initialize database
python manage.py migrate

# Create admin user
python manage.py createsuperuser
```

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

## 3️⃣ Start Everything

**Option A — Using the dev script (tmux required):**

```bash
./dev.sh
```

This starts both servers in a tmux session:
- Backend: http://localhost:8000/api/
- Frontend: http://localhost:5173/

**Option B — Manual (two terminals):**

```bash
# Terminal 1: Backend
source .venv/bin/activate
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 4️⃣ First Use

1. Open http://localhost:5173/
2. Click **Register** and create an account
3. A default project ("Mi Primer Proyecto") and graph ("Grafo Principal") are created automatically
4. You'll be redirected to the graph canvas — start adding nodes!

---

## 🔧 Helper Scripts

| Command | Description |
|---|---|
| `./dev.sh` | Start backend + frontend (tmux) |
| `./setup.sh` | Full initial setup (venv, deps, migrations) |
| `./helpers.sh check` | Check system status |
| `./helpers.sh reset-db` | Reset database (⚠️ deletes all data) |
| `./helpers.sh shell` | Open Django shell |
| `./helpers.sh migrations` | Create and apply migrations |
| `./helpers.sh create-user` | Create new superuser |
| `./helpers.sh urls` | Show all registered URL patterns |

---

## 🌐 Access Points

| Service | URL |
|---|---|
| Frontend | http://localhost:5173/ |
| Backend API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |

---

**For detailed documentation, see:**
- [Development Guide](./DEVELOPMENT.md) — Architecture, conventions, and workflows
- [API Reference](./API_ENDPOINTS.md) — Complete endpoint documentation
