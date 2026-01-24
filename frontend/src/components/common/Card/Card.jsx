import './Card.css';

/**
 * Card Component
 *
 * Reusable card with spotlight effect
 *
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {boolean} spotlight - Enable spotlight effect (default: true)
 */
export function Card({
  children,
  className = '',
  spotlight = true,
  ...props
}) {
  const classes = [
    'card',
    spotlight && 'spotlight-card',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {spotlight && (
        <>
          <div className="spotlight-effect"></div>
          <div className="spotlight-border"></div>
        </>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
