import { useTheme } from '../../../context/ThemeContext';
import './ThemeToggle.css';

/**
 * ThemeToggle Component
 *
 * A button to switch between light and dark themes
 * Features:
 * - Animated icon transition
 * - Accessible with keyboard
 * - Shows current theme
 */
export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode`}
    >
      <span className="theme-toggle-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle-text">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
