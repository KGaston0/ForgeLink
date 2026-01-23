# Components Directory

This directory contains reusable UI components.

## Structure

### `/common`
Generic, reusable components that can be used across the entire application.

**Examples:**
- `Button/` - Button component with variants
- `Input/` - Form input components
- `Card/` - Card container component
- `Modal/` - Modal/Dialog component
- `Loader/` - Loading indicators
- `Alert/` - Alert/notification components
- `Dropdown/` - Dropdown menu component
- `Badge/` - Badge/tag component
- `Tooltip/` - Tooltip component
- `Avatar/` - User avatar component

### `/layout`
Components that define the application layout structure.

**Examples:**
- `Header/` - Main header/navbar
- `Footer/` - Footer component
- `Sidebar/` - Sidebar navigation
- `MainLayout/` - Main page layout wrapper
- `AuthLayout/` - Layout for auth pages
- `AppShell/` - Application shell

## Best Practices

1. **One component per folder**: Each component should have its own folder
   ```
   Button/
   ├── Button.jsx
   ├── Button.module.css
   ├── Button.test.jsx
   └── index.js
   ```

2. **Props documentation**: Use PropTypes or TypeScript for prop validation

3. **Composition over props**: Prefer composition patterns over complex prop APIs

4. **Accessibility**: Always include proper ARIA labels and keyboard navigation

5. **Storybook**: Consider using Storybook for component documentation

## Component Template

```jsx
// Button/Button.jsx
import React from 'react';
import './Button.module.css';

/**
 * Reusable button component
 * @param {string} variant - Button style variant (primary, secondary, etc.)
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 */
export const Button = ({ 
  variant = 'primary', 
  children, 
  onClick,
  disabled = false,
  ...props 
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```
