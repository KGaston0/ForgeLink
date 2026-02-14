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
    // Check localStorage first
    const savedTheme = localStorage.getItem('forgelink-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }

    // Detect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  const [isManuallySet, setIsManuallySet] = useState(() => {
    return localStorage.getItem('forgelink-theme-manual') === 'true';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.setAttribute('data-theme', theme);

    // Save to localStorage
    localStorage.setItem('forgelink-theme', theme);

    if (isManuallySet) {
      localStorage.setItem('forgelink-theme-manual', 'true');
    }

    // Remove transition class after a short delay
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 100);
  }, [theme, isManuallySet]);

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
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const toggleTheme = () => {
    setIsManuallySet(true);
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setLightTheme = () => {
    setIsManuallySet(true);
    setTheme('light');
  };

  const setDarkTheme = () => {
    setIsManuallySet(true);
    setTheme('dark');
  };

  const resetToSystem = () => {
    setIsManuallySet(false);
    localStorage.removeItem('forgelink-theme');
    localStorage.removeItem('forgelink-theme-manual');
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    resetToSystem,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme hook
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
