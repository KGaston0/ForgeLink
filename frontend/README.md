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
│   │   ├── layout/         # Navigation, Footer
│   │   ├── common/         # Button, Card, Badge, LoadingSpinner
│   │   └── landing/        # Landing page sections
│   ├── pages/              # Application pages
│   │   ├── auth/           # Login, Register
│   │   └── ...
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
- **Styling:** Native CSS with CSS variables
- **Theme:** Dark/Light mode
- **State:** React Context API
- **Auth:** JWT with httpOnly cookies

---

## 📦 Components

Total: **11 components**

### Layout (2)
- `Navigation` - Navbar with dark mode toggle
- `Footer` - Site footer

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

---

## 🚧 In Development

- [ ] Main dashboard
- [ ] Project management
- [ ] Visual graph editor (canvas)
- [ ] Node and connection CRUD

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

**Last Updated:** 2026-02-14

