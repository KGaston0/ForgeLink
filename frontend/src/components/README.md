# ForgeLink Components

Component library for ForgeLink with reusable, modular architecture.

---

## 📦 Available Components

### Layout (2)
- **Navigation** - Main navbar with theme toggle
- **Footer** - Site footer with links and social

### Common (5)
- **Button** - Reusable button with variants (primary/secondary) and sizes
- **Card** - Card component with optional spotlight effect
- **Badge** - Small labels with 5 color variants
- **ThemeToggle** - Dark/Light mode switcher
- **LoadingSpinner** - Loading overlay for async operations

### Landing (5)
- **HeroSection** - Hero with animated node canvas
- **BentoGrid** - Feature grid with bento layout
- **DualPurpose** - Use cases section (PM + Creative)
- **PricingSection** - Pricing comparison table
- **CTASection** - Final call-to-action

---

## 🚀 Usage

### Basic Usage

```jsx
// Layout
import { Navigation, Footer } from '@/components/layout';

// Common
import { Button, Card, Badge, ThemeToggle, LoadingSpinner } from '@/components/common';

// Landing
import { HeroSection, BentoGrid } from '@/components/landing';

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

---

## 📝 Component Props

### Button
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```
**Props:** `variant` (primary/secondary), `size` (sm/md/lg), `onClick`, `disabled`, `className`

### Card
```jsx
<Card spotlight={true}>
  <p>Card content</p>
</Card>
```
**Props:** `spotlight` (boolean), `className`, `children`

### Badge
```jsx
<Badge variant="primary">New</Badge>
```
**Props:** `variant` (default/primary/success/warning/error), `className`, `children`

### ThemeToggle
```jsx
<ThemeToggle />
```
**Props:** None

### LoadingSpinner
```jsx
<LoadingSpinner />
```
**Props:** None required. Shows overlay with spinner during async operations.

---

## 📂 Structure

Each component folder contains:
- `Component.jsx` - Component code
- `Component.css` - Styles (optional)
- `index.js` - Export

---

## 🎨 Styling

All components use:
- CSS variables from design system
- Dark/light mode support
- Modular, scoped styles
- No external CSS libraries

See: [../styles/README.md](../styles/README.md)
