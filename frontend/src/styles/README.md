# ForgeLink Design System

Centralized design system for the entire ForgeLink project using CSS variables.

---

## 📁 Structure

```
styles/
├── variables.css    # CSS variables (colors, typography, spacing)
├── globals.css      # Global styles and reset
└── README.md        # This file
```

---

## 🎨 CSS Variables

### Colors

```css
/* Base */
--color-bg           /* Background */
--color-surface      /* Cards, modals */
--color-text         /* Primary text */
--color-text-muted   /* Secondary text */

/* Brand */
--color-primary      /* Cyan */
--color-secondary    /* Pink */
--color-cyan
--color-teal
--color-pink
--color-purple

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
--space-xs      /* 8px */
--space-sm      /* 16px */
--space-md      /* 24px */
--space-lg      /* 32px */
--space-xl      /* 48px */
--space-2xl     /* 64px */
--space-3xl     /* 80px */
--space-4xl     /* 88px */
--space-5xl     /* 96px */
```

### Effects

```css
/* Shadows */
--shadow-xs, --shadow-sm, --shadow-md
--shadow-lg, --shadow-xl, --shadow-2xl
--shadow-inner

/* Border Radius */
--radius-sm      /* 4px */
--radius-md      /* 8px */
--radius-lg      /* 12px */
--radius-xl      /* 16px */
--radius-full    /* 9999px */

/* Transitions */
--transition-fast    /* 150ms */
--transition-base    /* 300ms */
--transition-slow    /* 500ms */
```

---

## 🌗 Dark Mode

Activated automatically with `[data-theme="dark"]` on `<html>` element.

```css
/* Light Mode (default) */
:root {
  --color-bg: #fafafa;
  --color-text: #1e1e1e;
}

/* Dark Mode */
[data-theme="dark"] {
  --color-bg: #0a0a0f;
  --color-text: #e4e4e7;
}
```

---

## 🚀 Usage Examples

### Basic Component

```css
.my-component {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--space-md);
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
  box-shadow: var(--shadow-md);
  font-family: var(--font-body);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-base);
}

.btn-primary:hover {
  box-shadow: var(--shadow-xl);
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

## 📚 Related Documentation

- **Components:** [../components/README.md](../components/README.md)
- **Frontend:** [../../README.md](../../README.md)
- **Project:** [../../../README.md](../../../README.md)

---

**Last Updated:** 2026-01-24
