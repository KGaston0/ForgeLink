/**
 * LoadingSpinner Component
 *
 * Simple loading spinner for use across the app
 * Can be used for:
 * - Page transitions
 * - Data loading
 * - Form submissions
 *
 * @param {string} size - Size of the spinner: 'small', 'medium', or 'large'
 * @param {boolean} fullScreen - If true, displays as fullscreen overlay
 */
export default function LoadingSpinner({ size = 'medium', fullScreen = true }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-[3px]',
    large: 'w-15 h-15 border-4'
  };

  const spinnerClass = `${sizeClasses[size]} border-[rgb(var(--color-border))] border-t-cyan-500 rounded-full animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[9999]">
        <div className={spinnerClass}></div>
        <p className="mt-4 text-[rgb(var(--color-text-secondary))] text-[15px]">Loading...</p>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
}

