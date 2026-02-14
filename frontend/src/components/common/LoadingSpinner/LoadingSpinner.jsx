import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 *
 * Simple loading spinner for use across the app
 * Can be used for:
 * - Page transitions
 * - Data loading
 * - Form submissions
 */
export default function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loading-container">
        <div className={`spinner spinner-${size}`}></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return <div className={`spinner spinner-${size}`}></div>;
}

