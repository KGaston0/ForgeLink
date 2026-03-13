import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 *
 * A button to switch between light and dark themes
 * Features:
 * - Animated icon transition with rotation
 * - Accessible with keyboard
 * - Shows current theme
 */
export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-all duration-200 cursor-pointer"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode`}
    >
      <span className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-amber-500 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-primary transition-all duration-300 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </span>
      <span className="text-sm font-medium text-muted-foreground">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
