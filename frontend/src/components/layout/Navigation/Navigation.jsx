import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ThemeToggle } from '../../common/ThemeToggle/ThemeToggle';
import { UserMenu } from './UserMenu';

/**
 * Navigation Component
 *
 * Main navigation bar for the entire application
 * Features:
 * - Logo with link to home
 * - Navigation links
 * - Theme toggle
 * - Conditional rendering based on authentication state
 * - User menu dropdown when authenticated
 * - Login/Register buttons when not authenticated
 * - Responsive design
 * - Fixed position with backdrop blur
 */
export function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 backdrop-blur-xl bg-[rgb(var(--color-bg))]/80 border-b border-[rgb(var(--color-border))]">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-[rgb(var(--color-text))] hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center text-cyan-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.6"/>
              <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.8"/>
              <circle cx="12" cy="18" r="3" fill="currentColor"/>
              <path d="M6 6L12 18M18 6L12 18" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">ForgeLink</span>
        </Link>

        <div className="hidden md:flex gap-8">
          <a href="#gallery" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] font-medium text-[15px] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-cyan-500 after:transition-all hover:after:w-full">
            Gallery
          </a>
          <a href="#pricing" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] font-medium text-[15px] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-cyan-500 after:transition-all hover:after:w-full">
            Pricing
          </a>
          <a href="#docs" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] font-medium text-[15px] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-cyan-500 after:transition-all hover:after:w-full">
            Docs
          </a>
        </div>

        <div className="flex gap-4 items-center">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="btn-secondary">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">Start Free</button>
              </Link>
            </>
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </nav>
  );
}
