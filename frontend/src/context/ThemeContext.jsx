import { createContext, useContext, useState, useEffect } from 'react';

/**
 * ThemeContext - Manages light/dark mode theme
 *
 * Features:
 * - Persists theme in localStorage
 * - Detects system preference
 * - Smooth theme transitions
 * - Prevents flash of unstyled content
 */

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage first
    const savedTheme = localStorage.getItem('forgelink-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }

    // 2. Detect system preference (don't save yet)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 2. Detect system preference
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    // Add transitioning class to prevent flash
    root.classList.add('theme-transitioning');

    // Set data-theme attribute
    root.setAttribute('data-theme', theme);

    // Only save to localStorage if user manually set it
    if (isManuallySet) {
      localStorage.setItem('forgelink-theme', theme);
    }

    // Save to localStorage
    localStorage.setItem('forgelink-theme', theme);
  }, [theme, isManuallySet]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if user hasn't manually set a theme
      if (!isManuallySet) {
  }, [theme]);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Older browsers
      const savedTheme = localStorage.getItem('forgelink-theme');
      if (!savedTheme) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [isManuallySet]);

  const toggleTheme = () => {
    setIsManuallySet(true); // Mark as manually set
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setLightTheme = () => {
    setIsManuallySet(true); // Mark as manually set
  }, []);
  };

  const setDarkTheme = () => {
    setTheme('dark');
  };

  // Reset to system preference
  const resetToSystem = () => {
    setIsManuallySet(false);
  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
 *
 * @returns {Object} Theme state and controls
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
