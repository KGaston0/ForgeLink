# ForgeLink — Frontend

React single-page app: graph editor, project management and dashboard. Setup for the whole project is in the [root README](../README.md); how the editor and authentication work is in [DEVELOPMENT.md](../DEVELOPMENT.md).

## Commands

Run from `frontend/`.

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on http://localhost:5173 (needs the backend on :8000) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

Configuration: `VITE_API_URL` (default `http://localhost:8000/api`). Copy `.env.example` to `.env` to change it.

## Stack

React 19, Vite 7, Tailwind CSS v4, shadcn/ui (Radix + class-variance-authority), @xyflow/react 12, react-router-dom 7, axios, react-i18next, lucide-react.

## Structure

```
src/
├── App.jsx, main.jsx, index.css, i18n.js
├── components/
│   ├── layout/Sidebar/        Collapsible sidebar with the graph explorer tree
│   └── ui/                    shadcn primitives and shared components (button, avatar, tooltip,
│                              separator, theme-toggle, loading-spinner)
├── pages/                     One folder per route, page-specific components live beside the page
│   ├── auth/  home/  landing/  projects/  graphs/  nodelab/  settings/
├── features/graphs/           Graph editor: api/, components/ (canvas, toolbar, modals,
│                              nodes/, edges/), hooks/ (undo/redo), utils/
├── context/                   AuthContext, ThemeContext, ActivityFeedContext
├── services/api/              apiClient (axios, token refresh) and authService
├── config/apiConfig.js        API base URL and endpoint paths
├── routes/ProtectedRoute.jsx  Redirects unauthenticated visitors to /login
├── lib/utils.js               cn() helper (clsx + tailwind-merge)
├── locales/                   en.json, es.json
└── types/NodeType.js
```

Where new code goes:
- A complex, self-contained domain (own API calls, components and hooks) goes in `features/<name>/`.
- A simple page goes in `pages/<name>/`, with its tabs and components beside it.
- A primitive reused across the app goes in `components/ui/`, following shadcn conventions (kebab-case file, `cn()`, `forwardRef`).

Imports use the `@/` alias for `src/`, configured in `vite.config.js` and `jsconfig.json`:

```js
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Landing | Public |
| `/login`, `/register` | Authentication | Public |
| `/dashboard` | Stats, recent projects, resume work, activity feed | Protected |
| `/projects` | Projects list | Protected |
| `/projects/:id` | Project detail, Overview tab | Protected |
| `/projects/:id/settings` | Project detail, Settings tab | Protected |
| `/graphs/:id` | Graph editor | Protected |
| `/node-types` | Node Lab (blueprints and lists) | Protected |
| `/node-types/builder`, `/node-types/builder/:id` | Blueprint builder | Protected |
| `/settings` | User settings, language | Protected |

The `:id` of projects and graphs is the UUID.

## Design system

Tailwind v4 has no `tailwind.config.js`. Design tokens are HSL variables in `src/index.css`, registered as Tailwind colors in the `@theme inline` block, and swapped by a `.dark` class on `<html>`.

| Use | Classes |
|---|---|
| Surfaces | `bg-background`, `bg-card`, `bg-muted`, `bg-sidebar` |
| Text | `text-foreground`, `text-muted-foreground` |
| Brand | `text-primary` (cyan), `text-accent` (purple) |
| Borders and focus | `border-border`, `border-input`, `ring-ring` |
| Errors | `text-destructive`, `border-destructive` |

The explorer sidebar has its own tokens (`--explorer-foreground`, `--explorer-muted-foreground`, `--explorer-hover`).

`index.css` also defines legacy classes for components that predate shadcn: `.btn-primary`, `.btn-secondary`, `.input-field`, `.input-error`, and the older `--color-*` variables. Use the tokens and `components/ui` in new code.

`ThemeContext` exposes `theme`, `toggleTheme`, `isDark`, `isLight` and `resetToSystem`. It follows the system preference until the user picks a theme, then stores the choice in `localStorage` (`forgelink-theme`, `forgelink-theme-manual`).

## Conventions

- Functional components with hooks, one component per file.
- No hardcoded user-visible text outside the landing page: use `const { t } = useTranslation()`, with semantic keys such as `dashboard.resumeWork.title`, interpolation instead of concatenation, and every new key added to both `locales/en.json` and `locales/es.json`. Validation helpers receive `t` as a parameter.
- Forms validate on change and on blur, disable submit while invalid, and expose state with `aria-invalid`, `aria-describedby`, `aria-busy`, `role="alert"` for errors and `role="status"` for success. Every input has a label bound with `htmlFor`.
- Use the single `LoadingSpinner` for loading states.
