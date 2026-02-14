# ForgeLink Design System

Centralized design system with CSS variables for consistent styling across the project.

---

## 📁 Structure

```
styles/
├── variables.css    # CSS variables (colors, typography, spacing)
├── globals.css      # Global styles and reset
└── theme/           # Theme system (future expansion)
```

---

## 🎨 CSS Variables

### Colors

```css
/* Base */
--color-bg           /* Background */
--color-surface      /* Surface/Card background */
--color-text         /* Primary text */
--color-text-muted   /* Secondary text */

/* Brand */
--color-primary      /* Primary brand color */
--color-secondary    /* Secondary brand color */
--color-cyan
--color-teal
--color-pink

/* Semantic */
--color-success      /* Green */
--color-error        /* Red */
--color-warning      /* Yellow */
--color-info         /* Blue */
```

### Typography

```css
/* Families */
--font-heading       /* Outfit */
--font-body          /* Plus Jakarta Sans */
--font-mono          /* JetBrains Mono */

/* Sizes */
--font-size-xs       /* 12px */
--font-size-sm       /* 14px */
--font-size-base     /* 16px */
--font-size-lg       /* 18px */
--font-size-xl       /* 20px */
--font-size-2xl      /* 24px */
--font-size-3xl      /* 30px */
--font-size-4xl      /* 36px */
--font-size-5xl      /* 48px */
--font-size-6xl      /* 60px */

/* Weights */
--font-weight-light      /* 300 */
--font-weight-normal     /* 400 */
--font-weight-medium     /* 500 */
--font-weight-semibold   /* 600 */
--font-weight-bold       /* 700 */
--font-weight-extrabold  /* 800 */
```

### Spacing (8pt Grid)

```css
--space-0       /* 0px */
--space-xs      /* 8px */
--space-sm      /* 16px */
--space-md      /* 24px */
--space-lg      /* 32px */
--space-xl      /* 40px */
--space-2xl     /* 48px */
--space-3xl     /* 64px */
--space-4xl     /* 80px */
```

### Effects

```css
/* Shadows */
--shadow-xs      /* Subtle shadow */
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl     /* Strong shadow */

/* Border Radius */
--radius-sm      /* 4px */
--radius-md      /* 8px */
--radius-lg      /* 12px */
--radius-xl      /* 16px */
--radius-2xl     /* 24px */
--radius-full    /* 9999px */

/* Transitions */
--transition-fast    /* 150ms */
--transition-base    /* 200ms */
--transition-slow    /* 300ms */
```

---

## 🌗 Dark Mode

Dark mode is activated automatically with the `[data-theme="dark"]` attribute on the `<html>` element.

```css
:root {
  --color-bg: #fafafa;
  --color-text: #1e1e1e;
}

[data-theme="dark"] {
  --color-bg: #0a0a0f;
  --color-text: #e4e4e7;
}
```

All colors adapt automatically to the theme.

---

## 🚀 Usage Examples

### Basic Component

```css
.my-component {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

### Button with Gradient

```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-cyan), var(--color-teal));
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--font-weight-semibold);
  transition: transform var(--transition-fast);
}

.btn-primary:hover {
  transform: translateY(-2px);
}
```

### Card with Spotlight Effect

```css
.card {
  position: relative;
  background: var(--color-surface);
  padding: var(--space-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(6, 182, 212, 0.15),
    transparent 50%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover::before {
  opacity: 1;
}
```

---

## 📚 References

- **Components:** [../components/README.md](../components/README.md)
- **Frontend:** [../../README.md](../../README.md)
- **Project:** [../../../README.md](../../../README.md)

