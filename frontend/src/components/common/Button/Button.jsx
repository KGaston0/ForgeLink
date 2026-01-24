import './Button.css';

/**
 * Button Component
 *
 * Reusable button with multiple variants and sizes
 *
 * @param {string} variant - 'primary' | 'secondary' (default: 'primary')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Disabled state
 * @param {ReactNode} children - Button content
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
