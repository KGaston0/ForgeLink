import { useTheme } from '../../../context/ThemeContext';

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
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))]/80 transition-all duration-200"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode`}
    >
      <span className="text-lg transition-transform duration-200 hover:scale-110">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
