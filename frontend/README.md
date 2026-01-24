# ForgeLink Frontend
React frontend for ForgeLink - Node-based project management and worldbuilding system.
---
## 🚀 Quick Start
### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Frontend available at: **http://localhost:5173/**

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         #   Generic components (Button, Card, Badge)
│   │   ├── layout/         #   Layout components (Navigation, Footer)
│   │   └── landing/        #   Landing page sections
│   ├── pages/              # Page components (one per route)
│   │   ├── auth/           #   Login, Register pages
│   │   ├── home/           #   Dashboard/Home
│   │   ├── projects/       #   Projects pages
│   │   ├── graphs/         #   Graphs pages
│   │   └── nodes/          #   Nodes pages
│   ├── features/           # Feature modules (business logic)
│   │   ├── auth/           #   Authentication feature
│   │   │   ├── components/ #     Feature-specific components
│   │   │   ├── hooks/      #     Feature hooks
│   │   │   └── api/        #     API calls
│   │   ├── projects/
│   │   ├── graphs/
│   │   ├── nodes/
│   │   └── connections/
│   ├── services/           # External services
│   │   └── api/            #   API client configuration
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React Context providers (Theme, Auth)
│   ├── routes/             # Route configuration
│   ├── styles/             # Design system and global styles
│   │   ├── variables.css   #   CSS variables (colors, typography, spacing)
│   │   ├── globals.css     #   Global reset and base styles
│   │   └── theme/          #   Theme system files
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types (if using TS)
│   ├── config/             # App configuration
│   └── assets/             # Static assets (images, icons)
├── public/                 # Static files
└── README.md               # This file
```

> **Note:** See [DEVELOPMENT.md](../DEVELOPMENT.md) for detailed architecture documentation.
---
## 📚 Documentation
- **Components:** See [src/components/README.md](./src/components/README.md)
- **Design System:** See [src/styles/README.md](./src/styles/README.md)
- **Backend API:** See [../API_ENDPOINTS.md](../API_ENDPOINTS.md)
---
## 🎨 Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Native CSS with CSS variables
- **State Management:** React Context API
- **Routing:** React Router (future)
- **HTTP Client:** Native fetch API
- **Dark Mode:** Theme system with CSS variables
---
## 🏗️ Development Progress
### ✅ Completed
- [x] Complete landing page
- [x] Reusable component system (10 components)
- [x] Design system with CSS variables
- [x] Dark mode / Light mode
- [x] Modular and scalable architecture
- [x] Navigation and footer
- [x] Landing sections: Hero, Bento Grid, Dual Purpose, Pricing, CTA
### 🚧 In Development
- [ ] Authentication system (JWT)
- [ ] Main dashboard
- [ ] Project management
- [ ] Node canvas (graph editor)
- [ ] Node and connection CRUD
### 📋 Roadmap
- [ ] Complete authentication
- [ ] Visual graph editor
- [ ] Node and connection management
- [ ] Real-time collaboration
- [ ] Data export/import
- [ ] Customizable themes
- [ ] Unit tests
- [ ] Component Storybook
---
## 🔗 Backend
Frontend connects to Django REST API backend:
- **Backend URL:** http://localhost:8000/api/
- **Documentation:** [../README.md](../README.md)
- **API Endpoints:** [../API_ENDPOINTS.md](../API_ENDPOINTS.md)
---
## 🛠️ Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

---

## 📦 Available Components

Total: **10  components**

### Layout (2):
- `Navigation` - Navbar with dark mode toggle
- `Footer` - Site footer

### Common (3):
- `Button` - Button with variants (primary/secondary) and sizes
- `Card` - Card with spotlight effect
- `Badge` - Labels with 5 variants

### Landing (5):
- `HeroSection` - Hero with animated node canvas
- `BentoGrid` - Feature grid
- `DualPurpose` - Use cases (PM + Creative)
- `PricingSection` - Pricing table
- `CTASection` - Final call to action
**See complete documentation:** [src/components/README.md](./src/components/README.md)
---
## 🎨 Design System
Centralized design system with CSS variables:
- **Colors:** Auto light/dark mode
- **Typography:** 3 font families
- **Spacing:** 8pt grid system
- **Shadows:** 7 elevation levels
- **Border Radius:** 5 predefined sizes
- **Transitions:** 3 speeds
**See documentation:** [src/styles/README.md](./src/styles/README.md)
---
## 📄 License
MIT License - See [../LICENSE](../LICENSE)
---
**Last Updated:** 2026-01-24
