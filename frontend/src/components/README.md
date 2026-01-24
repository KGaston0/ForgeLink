# ForgeLink Components
Component library for ForgeLink project with reusable, modular architecture.
---
## 📦 Available Components
### Layout (2)
- **Navigation** - Main navbar with theme toggle
- **Footer** - Site footer with links and social
### Common (4)
- **Button** - Reusable button with variants (primary/secondary) and sizes
- **Card** - Card component with optional spotlight effect
- **Badge** - Small labels with 5 color variants
- **ThemeToggle** - Dark/Light mode switcher
### Landing (5)
- **HeroSection** - Hero with animated node canvas
- **BentoGrid** - Feature grid with bento layout
- **DualPurpose** - Use cases section (PM + Creative)
- **PricingSection** - Pricing comparison table
- **CTASection** - Final call-to-action
---
## 🚀 Quick Start
### Basic Usage

```jsx
// Layout
import { Navigation, Footer } from '@/components/layout';

// Common
import { Button, Card, Badge, ThemeToggle } from '@/components/common';

// Landing
import { HeroSection, BentoGrid, DualPurpose, PricingSection, CTASection } from '@/components/landing';

function App() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <BentoGrid />
      <Footer />
    </>
  );
}
```
### Component Props

#### Button
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```
**Props:** `variant` (primary/secondary), `size` (sm/md/lg), `onClick`, `disabled`, `className`

#### Card
```jsx
<Card spotlight={true}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```
**Props:** `spotlight` (boolean), `className`, `children`

#### Badge
```jsx
<Badge variant="success">Active</Badge>
```
**Props:** `variant` (default/primary/success/warning/error), `className`, `children`

#### ThemeToggle
```jsx
<ThemeToggle />
```
Uses ThemeContext to toggle between light/dark modes.
---
## 📁 Structure

```
components/
├── layout/          # Navigation, Footer
├── common/          # Button, Card, Badge, ThemeToggle
└── landing/         # HeroSection, BentoGrid, DualPurpose, PricingSection, CTASection
```

> **Note:** Feature-specific components (e.g., ProjectCard, NodeEditor) are located in their respective feature folders: `src/features/{feature}/components/`

Each component folder contains:
- `Component.jsx` - Component code
- `Component.css` - Styles (optional)
- `index.js` - Export
---
## 🎨 Design System

All components use CSS variables from the design system:
- Colors: `--color-*`
- Fonts: `--font-*`
- Spacing: `--space-*`
- Shadows: `--shadow-*`
- Radius: `--radius-*`
- Transitions: `--transition-*`

**See:** [../styles/README.md](../styles/README.md) for complete variable reference.

**Last Updated:** 2026-01-24  
**Documentation:** [Complete project docs](../../../DEVELOPMENT.md)
