import { ThemeToggle } from '../../common/ThemeToggle/ThemeToggle';
import './Navigation.css';

/**
 * Navigation Component
 *
 * Main navigation bar for the entire application
 * Features:
 * - Logo with link to home
 * - Navigation links
 * - Theme toggle
 * - Action buttons (Login, Start Free)
 * - Responsive design
 * - Fixed position with backdrop blur
 */
export function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <a href="/" className="logo-link">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.6"/>
              <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.8"/>
              <circle cx="12" cy="18" r="3" fill="currentColor"/>
              <path d="M6 6L12 18M18 6L12 18" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            </svg>
          </div>
          <span className="logo-text">LinkForge</span>
        </a>

        <div className="nav-links">
          <a href="#gallery" className="nav-link">Gallery</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#docs" className="nav-link">Docs</a>
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn-secondary">Login</button>
          <button className="btn-primary">Start Free</button>
        </div>
      </div>
    </nav>
  );
}
