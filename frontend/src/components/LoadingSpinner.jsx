import '../styles/LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;

