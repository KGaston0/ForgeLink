/**
 * LoadingSpinner Component
 *
 * Simple loading spinner for use across the app.
 * Uses theme-aware colors via shadcn CSS variables.
 *
 * @param {string} size - Size of the spinner: 'small', 'medium', or 'large'
 * @param {boolean} fullScreen - If true, displays as fullscreen overlay
 */
export default function LoadingSpinner({ size = 'medium', fullScreen = true }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-[3px]',
    large: 'w-16 h-16 border-4'
  };

  const spinnerClass = `${sizeClasses[size]} border-border border-t-primary rounded-full animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[9999]">
        <div className={spinnerClass}></div>
        <p className="mt-4 text-muted-foreground text-[15px]">Loading...</p>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
}
