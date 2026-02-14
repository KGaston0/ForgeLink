- [ ] Crear componentes reutilizables
- [ ] Documentar patrones comunes
- [ ] Agregar más temas (opcional)
\`\`\`
El modo oscuro se activa automáticamente con el atributo `[data-theme="dark"]`.
- Sombras: `--shadow-xs` hasta `--shadow-2xl`
- Radius: `--radius-sm` hasta `--radius-full`
\`\`\`
\`\`\`css
- Tamaños: `--font-size-xs` hasta `--font-size-6xl`
- Pesos: `--font-weight-light` hasta `--font-weight-extrabold`
- `--color-bg`, `--color-surface`, `--color-text`
- `--color-primary`, `--color-secondary`
- Semantic: `--color-success`, `--color-error`, `--color-warning`, `--color-info`
├── globals.css      # Estilos globales y reset
└── theme/           # Sistema de temas (futuro)
Sistema de diseño centralizado para todo el proyecto.
# ForgeLink Design System

\`\`\`

---

## 📁 Structure

```
\`\`\`css
├── variables.css    # CSS variables (colors, typography, spacing)
├── globals.css      # Global styles and reset
```

---

## 🎨 CSS Variables

### Colors

```css
/* Base */
--color-bg           /* Background */
--font-size-base     /* 16px */
--color-text         /* Primary text */
--color-text-muted   /* Secondary text */

/* Brand */
--font-size-3xl      /* 30px */
--font-size-4xl      /* 36px */
--color-cyan
--color-teal
--color-pink
--font-size-6xl      /* 60px */
--color-error        /* Red */
--color-warning      /* Yellow */
--color-info         /* Blue */
```

### Typography

```css
/* Families */
--font-heading       /* Outfit */
--font-body          /* Plus Jakarta Sans */
\`\`\`

/* Sizes */
\`\`\`css
--font-size-sm       /* 14px */
--font-size-md       /* 16px - base */
--font-size-lg       /* 18px */
--font-size-xl       /* 20px */
--space-xl      /* 48px */
--space-2xl     /* 64px */
--space-3xl     /* 80px */
--space-4xl     /* 88px */
--font-size-5xl      /* 48px */
\`\`\`

/* Weights */
\`\`\`css
--font-weight-normal     /* 400 */
--font-weight-medium     /* 500 */
--font-weight-semibold   /* 600 */
--font-weight-extrabold  /* 800 */
```

### Spacing (8pt Grid)

```css
--space-0       /* 0px */
--space-xs      /* 8px */
--space-sm      /* 16px */
--space-lg      /* 32px */
--space-xl      /* 40px */
--space-2xl     /* 48px */
--space-3xl     /* 64px */
\`\`\`
```

### Effects

```css
Activated automatically with \`[data-theme="dark"]\` on \`<html>\` element.
\`\`\`css
/* Border Radius */
--radius-sm      /* 4px */
--radius-md      /* 8px */
--radius-xl      /* 16px */
--radius-full    /* 9999px */

/* Transitions */
--transition-fast    /* 150ms */
\`\`\`
```

---

## 🌗 Dark Mode


```css
\`\`\`css
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
\`\`\`
  color: var(--color-text);
\`\`\`css
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
\`\`\`
}

.btn-primary:hover {
\`\`\`css
  transform: translateY(-2px);
}
```

### Card with Spotlight Effect

```css
.card {
  position: relative;
  background: var(--color-surface);
  padding: var(--space-lg);
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
}

.card:hover::before {
  opacity: 1;
}
```

---

\`\`\`

- **Frontend:** [../../README.md](../../README.md)
- **Project:** [../../../README.md](../../../README.md)

---

**Last Updated:** 2026-01-24
