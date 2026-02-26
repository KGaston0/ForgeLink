# ForgeLink Frontend

React + Vite frontend for ForgeLink with modular design system.

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: http://localhost:5173/

---

## 📁 Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/         # Navigation, Footer, Sidebar
│   │   ├── common/         # Button, Card, Badge, LoadingSpinner
│   │   └── landing/        # Landing page sections
│   ├── pages/              # Application pages
│   │   ├── auth/           # Login, Register
│   │   ├── home/           # Dashboard
│   │   ├── graphs/         # GraphCanvasPage
│   │   └── settings/       # Settings
│   ├── features/           # Feature modules
│   │   └── graphs/         # GraphCanvas component
│   ├── context/            # React Context providers (Theme, Auth)
│   ├── services/           # API client and services
│   ├── routes/             # Route configuration
│   ├── styles/             # Design system and global styles
│   ├── config/             # App configuration
│   └── assets/             # Static assets
├── public/                 # Static files
└── package.json
```

---

## 📚 Documentation

- **Components:** [src/components/README.md](./src/components/README.md)
- **Design System:** [src/styles/README.md](./src/styles/README.md)
- **Backend API:** [../API_ENDPOINTS.md](../API_ENDPOINTS.md)
- **Development:** [../DEVELOPMENT.md](../DEVELOPMENT.md)

---

## 🎨 Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 with custom design system
- **Theme:** Dark/Light mode with CSS variables
- **State:** React Context API
- **Auth:** JWT with httpOnly cookies
- **Routing:** React Router v7

---

## 📦 Components

Total: **13 components**

### Layout (3)
- `Navigation` - Navbar with dark mode toggle
- `Footer` - Site footer
- `Sidebar` - Sidebar de navegación para dashboard y canvas

### Common (5)
- `Button` - Button with variants and sizes
- `Card` - Card with spotlight effect
- `Badge` - Labels with 5 variants
- `ThemeToggle` - Dark/Light mode switcher
- `LoadingSpinner` - Loading overlay

### Landing (5)
- `HeroSection` - Hero with animated node canvas
- `BentoGrid` - Feature grid
- `DualPurpose` - Use cases (PM + Creative)
- `PricingSection` - Pricing table
- `CTASection` - Final call to action

See complete documentation: [src/components/README.md](./src/components/README.md)

---

## ✅ Completed Features

- [x] Landing page with 11 modular components
- [x] Design system with dark/light mode
- [x] Authentication system (JWT)
- [x] Login/Register pages with validation
- [x] Protected routes
- [x] AuthContext and authService
- [x] LoadingSpinner with overlay
- [x] Dashboard principal con sidebar de navegación
- [x] GraphCanvas con @xyflow/react para visualización de grafos
- [x] Redirección automática al "Grafo Principal" tras login
- [x] Persistencia de posiciones de nodos (PATCH)

---

## 🚧 In Development

- [ ] CRUD completo de nodos desde UI
- [ ] CRUD completo de conexiones desde UI
- [ ] Gestión completa de proyectos
- [ ] Creación de nuevos grafos
- [ ] Toolbar de herramientas en canvas

---

## 🎨 Styling with Tailwind CSS

**Configuration:**
- Tailwind CSS v4 with PostCSS plugin
- Custom design tokens via CSS variables
- Dark mode with `class` strategy
- Custom utility classes in `index.css`

**Custom Classes:**
```css
.btn-primary      /* Primary button with gradient */
.btn-secondary    /* Secondary button with border */
.input-field      /* Form input with focus ring */
.input-error      /* Error state for inputs */
```

**CSS Variables:**
```css
--color-bg              /* Background color */
--color-text            /* Text color */
--color-border          /* Border color */
/* All colors support dark mode automatically */
```

**Usage:**
```jsx
// Tailwind utilities
<div className="flex items-center gap-4 p-8">

// With CSS variables
<div className="bg-[rgb(var(--color-bg))]">

// Custom classes
<button className="btn-primary">Click me</button>
```

---

## 🎨 Design System

Centralized design system with CSS variables:

- **Colors:** Auto light/dark mode
- **Typography:** 3 font families
- **Spacing:** 8pt grid system
- **Shadows:** 7 elevation levels
- **Transitions:** 3 speeds

See: [src/styles/README.md](./src/styles/README.md)

---

## 🛠️ Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code
```

---

## 🔗 Backend

Frontend connects to Django REST API:

- **Backend URL:** http://localhost:8000/api/
- **Documentation:** [../README.md](../README.md)
- **API Endpoints:** [../API_ENDPOINTS.md](../API_ENDPOINTS.md)

---

**Last Updated:** 2026-02-24

