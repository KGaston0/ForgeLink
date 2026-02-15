import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

/**
 * UserMenu Component
 *
 * Dropdown menu for authenticated users
 * Features:
 * - User avatar with first letter of username
 * - Dropdown with navigation links
 * - Logout functionality
 * - Click outside to close
 * - Keyboard accessible
 */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const getInitials = () => {
    if (!user?.user?.username) return '?';
    return user.user.username.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white border-2 border-[rgb(var(--color-border))] font-semibold text-base cursor-pointer transition-all duration-200 flex items-center justify-center hover:scale-105 hover:shadow-[0_0_0_4px_rgba(6,182,212,0.1)] active:scale-95"
      >
        {getInitials()}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.5rem)] right-0 min-w-[200px] bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg shadow-lg py-2 animate-slide-down z-[1000]"
        >
          <div className="px-4 py-3">
            <span className="font-semibold text-[rgb(var(--color-text))] text-[15px]">
              @{user?.user?.username || 'User'}
            </span>
          </div>

          <div className="h-px bg-[rgb(var(--color-border))] my-2"></div>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text))] text-[15px] transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text))] text-[15px] transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M6 3.27l3 5.2m6 0l3-5.2M3.27 6l5.2 3m0 6l-5.2 3M6 20.73l3-5.2m6 0l3 5.2M20.73 18l-5.2-3m0-6l5.2-3" />
            </svg>
            Settings
          </Link>

          <div className="h-px bg-[rgb(var(--color-border))] my-2"></div>

          <button
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-500/10 text-[15px] transition-colors text-left"
            onClick={handleLogout}
            role="menuitem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}


