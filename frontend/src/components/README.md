# ForgeLink — Component Library

Reusable UI components organized by category.

---

## Layout (3)

| Component | Description | Location |
|---|---|---|
| `Navigation` | Top navbar with logo, nav links, theme toggle, auth buttons | `layout/Navigation/` |
| `Footer` | Site footer with links and social icons | `layout/Footer/` |
| `Sidebar` | Side navigation for dashboard, projects, and graph canvas | `layout/Sidebar/` |

## Common (5)

| Component | Description | Location |
|---|---|---|
| `Button` | Button with variant and size props | `common/Button/` |
| `Card` | Card container with optional spotlight hover effect | `common/Card/` |
| `Badge` | Small label with color variants | `common/Badge/` |
| `ThemeToggle` | Dark/light mode switcher | `common/ThemeToggle/` |
| `LoadingSpinner` | Spinner overlay (fullscreen or inline) | `common/LoadingSpinner/` |

## Landing (5)

| Component | Description | Location |
|---|---|---|
| `HeroSection` | Hero with animated node canvas and CTA | `landing/HeroSection/` |
| `BentoGrid` | Feature showcase in bento grid layout | `landing/BentoGrid/` |
| `DualPurpose` | Use cases section (project management + creative) | `landing/DualPurpose/` |
| `PricingSection` | Pricing comparison table | `landing/PricingSection/` |
| `CTASection` | Final call-to-action | `landing/CTASection/` |

---

## Props Reference

### Button
```jsx
<Button variant="primary" size="lg" onClick={fn} disabled={false}>
  Label
</Button>
```
| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | string | `"primary"` | `"primary"`, `"secondary"` |
| `size` | string | `"md"` | `"sm"`, `"md"`, `"lg"` |
| `onClick` | function | — | |
| `disabled` | boolean | `false` | |
| `className` | string | `""` | Additional classes |

### Card
```jsx
<Card spotlight={true}>Content</Card>
```
| Prop | Type | Default | Description |
|---|---|---|---|
| `spotlight` | boolean | `false` | Enable spotlight hover effect |
| `className` | string | `""` | Additional classes |
| `children` | node | — | Card content |

### Badge
```jsx
<Badge variant="success">Active</Badge>
```
| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | string | `"default"` | `"default"`, `"primary"`, `"success"`, `"warning"`, `"error"` |

### LoadingSpinner
```jsx
<LoadingSpinner size="medium" fullScreen={true} />
```
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | string | `"medium"` | `"small"`, `"medium"`, `"large"` |
| `fullScreen` | boolean | `true` | Fullscreen overlay vs inline spinner |

### ThemeToggle
```jsx
<ThemeToggle />
```
No props. Uses `ThemeContext` internally.

---

## Conventions

- Each component lives in its own folder: `ComponentName/`
- Folder contains `ComponentName.jsx` + `index.js` (re-export)
- All components use CSS variables from `index.css` for theming
- Dark/light mode support is automatic via CSS variables

---

**See also:** [Development Guide → Design System](../../DEVELOPMENT.md#design-system)
