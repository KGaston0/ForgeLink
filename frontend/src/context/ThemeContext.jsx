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

    // 2. Detect system preference
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

    // Save to localStorage
    localStorage.setItem('forgelink-theme', theme);

    // Remove transitioning class after a brief delay
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 50);

    return () => clearTimeout(timer);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if user hasn't manually set a theme
      const savedTheme = localStorage.getItem('forgelink-theme');
      if (!savedTheme) {
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
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
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
