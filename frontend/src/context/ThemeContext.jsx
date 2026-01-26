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
  // Track if user has manually set theme (vs auto-detected)
  const [isManuallySet, setIsManuallySet] = useState(() => {
    return localStorage.getItem('forgelink-theme') !== null;
  });

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

    // 3. Default to light
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

    // Remove transitioning class after a brief delay
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 50);

    return () => clearTimeout(timer);
  }, [theme, isManuallySet]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if user hasn't manually set a theme
      if (!isManuallySet) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Older browsers
    else if (mediaQuery.addListener) {
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
    setTheme('light');
  };

  const setDarkTheme = () => {
    setIsManuallySet(true); // Mark as manually set
    setTheme('dark');
  };

  // Reset to system preference
  const resetToSystem = () => {
    setIsManuallySet(false);
    localStorage.removeItem('forgelink-theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    resetToSystem,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isManuallySet,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 *
 * Access theme state and controls from any component
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
