# ForgeLink Styling System

ForgeLink uses **Tailwind CSS v4** with custom CSS variables for theming and dark mode support.

---

## 📁 Structure

```
styles/
└── index.css        # Tailwind imports + custom utilities + CSS variables
```

---

## 🎨 Tailwind CSS v4

**Configuration:**
- `tailwind.config.js` - Tailwind configuration with dark mode
- `postcss.config.js` - PostCSS with @tailwindcss/postcss plugin
- `index.css` - Tailwind directives and custom utilities

**Imports:**
```css
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);
```

---

## 🌗 Dark Mode

Dark mode is controlled via the `dark` class on `<html>` element.

**CSS Variables (Light Mode):**
```css
--color-bg: 255 255 255;
--color-bg-secondary: 248 249 250;
--color-text: 26 26 31;
--color-text-secondary: 107 114 128;
--color-border: 229 231 235;
```

**CSS Variables (Dark Mode):**
```css
html.dark {
  --color-bg: 26 26 31;
  --color-bg-secondary: 31 31 36;
  --color-text: 248 250 252;
  --color-text-secondary: 161 161 170;
  --color-border: 39 39 42;
}
```

**Usage:**
```jsx
<div className="bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]">
  Content adapts to dark/light mode
</div>
```

---

## 🎨 Custom Utility Classes

Defined in `index.css`:

**Buttons:**
```css
.btn-primary      /* Gradient button (cyan to purple) */
.btn-secondary    /* Bordered button with transparent bg */
```

**Inputs:**
```css
.input-field      /* Form input with focus ring */
.input-error      /* Error state with red border */
```

**Usage:**
```jsx
<button className="btn-primary">Click me</button>
<input className="input-field" />
<input className="input-field input-error" />
```

---

## 📐 Tailwind Utilities

**Spacing:**
```jsx
p-4       /* padding: 1rem */
m-8       /* margin: 2rem */
gap-6     /* gap: 1.5rem */
```

**Colors:**
```jsx
bg-cyan-500       /* Background */
text-purple-500   /* Text */
border-gray-200   /* Border */
```

**Layout:**
```jsx
flex              /* Flexbox */
grid              /* Grid */
items-center      /* Align items center */
justify-between   /* Justify space-between */
```

**Responsive:**
```jsx
md:flex           /* Flex on medium screens and up */
lg:grid-cols-3    /* 3 columns on large screens */
```

**Dark Mode:**
```jsx
dark:bg-gray-800  /* Background in dark mode */
dark:text-white   /* Text in dark mode */
```

---

## 🎯 Best Practices

**Do:**
```jsx
// Use Tailwind utilities
<div className="flex items-center gap-4 p-8">

// Use CSS variables for theme colors
<div className="bg-[rgb(var(--color-bg))]">

// Use custom classes for repeated patterns
<button className="btn-primary">
```

**Don't:**
```jsx
// Don't use inline styles
<div style={{ display: 'flex' }}>

// Don't create new CSS files
// Use Tailwind utilities instead
```

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [React + Tailwind Best Practices](https://tailwindcss.com/docs/guides/vite)

---

**Last Updated:** 2026-02-14

