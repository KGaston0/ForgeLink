# ForgeLink Frontend

React application for ForgeLink - A worldbuilding and knowledge graph management system.

## 📁 Project Structure

```
frontend/
├── public/                 # Static files (index.html, favicon, etc.)
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Generic components (Button, Input, Modal, etc.)
│   │   └── layout/       # Layout components (Header, Footer, Sidebar, etc.)
│   ├── pages/            # Page components (one per route)
│   │   ├── auth/         # Authentication pages (Login, Register, etc.)
│   │   ├── home/         # Home/Dashboard page
│   │   ├── projects/     # Project-related pages
│   │   ├── graphs/       # Graph visualization pages
│   │   └── nodes/        # Node management pages
│   ├── features/         # Feature-based modules (business logic + components)
│   │   ├── auth/         # Authentication logic, hooks, components
│   │   ├── projects/     # Project management feature
│   │   ├── graphs/       # Graph feature
│   │   ├── nodes/        # Node management feature
│   │   └── connections/  # Connection management feature
│   ├── services/         # External services and API calls
│   │   └── api/          # API client and endpoints
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context providers (Auth, Theme, etc.)
│   ├── routes/           # Route configuration
│   ├── utils/            # Utility functions and helpers
│   ├── types/            # TypeScript type definitions (if using TS)
│   ├── config/           # Configuration files
│   ├── assets/           # Images, icons, fonts
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── styles/           # Global styles and theme
│       ├── themes/
│       └── global/
└── tests/                # Test files
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── e2e/             # End-to-end tests

```

## 🏗️ Architecture Principles

### Feature-Based Structure
- Each feature module contains its own components, hooks, and logic
- Promotes modularity and maintainability
- Easy to test and scale

### Separation of Concerns
- **Components**: Pure UI components, reusable
- **Pages**: Compose components for specific routes
- **Features**: Business logic + feature-specific components
- **Services**: API calls and external integrations
- **Hooks**: Reusable stateful logic
- **Context**: Global state management

### Best Practices
- Atomic design principles for components
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Proper error handling and loading states
- Accessibility (a11y) first
- Responsive design
- Performance optimization (lazy loading, memoization)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📦 Recommended Dependencies

- **React Router** - Navigation
- **Axios** or **React Query** - API calls
- **Zustand** or **Redux Toolkit** - State management (if needed)
- **Tailwind CSS** or **Material-UI** - Styling
- **React Hook Form** - Form handling
- **Zod** or **Yup** - Validation
- **React Flow** or **D3.js** - Graph visualization
- **React Testing Library** - Testing

## 🔐 Environment Variables

Create a `.env` file in the frontend root:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

## 📝 Notes

- This structure follows modern React best practices
- Easily scalable for large applications
- Supports both JavaScript and TypeScript
- Ready for testing implementation
