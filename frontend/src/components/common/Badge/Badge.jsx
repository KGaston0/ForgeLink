import './Badge.css';

/**
 * Badge Component
 *
 * Small label/tag component with different variants
 *
 * @param {ReactNode} children - Badge content
 * @param {string} variant - 'default' | 'primary' | 'success' | 'warning' | 'error' (default: 'default')
 * @param {string} className - Additional CSS classes
 */
export function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const classes = [
    'badge',
    `badge-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
