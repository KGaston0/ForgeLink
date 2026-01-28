\`\`\`bash
## Expanding the ESLint configuration
\`\`\`
## React Compiler
\`\`\`bash
\`\`\`
Currently, two official plugins are available:
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
# React + Vite
---
## 🚀 Quick Start

```bash
cd frontend
\`\`\`bash
```

### Development

```bash
\`\`\`

\`\`\`

### Production Build

```bash
│   ├── components/         # Reusable components
│   │   ├── layout/         # Navigation, Footer
│   │   ├── common/         # Button, Card, Badge
│   │   └── landing/        # Landing page sections
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
│   │   ├── variables.css   # CSS variables (colors, typography, spacing)
│   │   ├── globals.css     # Global reset and base styles
│   │   └── README.md       # Design system documentation
│   ├── context/            # React contexts (Theme, Auth)
│   ├── pages/              # Application pages
│   ├── services/           # API calls and services
│   └── utils/              # Utilities and helpers
├── public/                 # Static assets
- [x] Modular and scalable architecture
- [x] Navigation and footer
\`\`\`
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
\`\`\`
```

---

## 📦 Available Components

Total: **10  components**

### Layout (2):
- \`Navigation\` - Navbar with dark mode toggle
- \`Footer\` - Site footer
- `Navigation` - Navbar with dark mode toggle
- `Footer` - Site footer

### Common (3):
- \`Button\` - Button with variants (primary/secondary) and sizes
- \`Card\` - Card with spotlight effect
- \`Badge\` - Labels with 5 variants
- `Button` - Button with variants (primary/secondary) and sizes
- `Card` - Card with spotlight effect
- `Badge` - Labels with 5 variants

### Landing (5):
- \`HeroSection\` - Hero with animated node canvas
- \`BentoGrid\` - Feature grid
- \`DualPurpose\` - Use cases (PM + Creative)
- \`PricingSection\` - Pricing table
- \`CTASection\` - Final call to action
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
\`\`\`bash
- **Transitions:** 3 speeds
---
## 📄 License
---
**Last Updated:** 2026-01-24
