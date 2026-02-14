import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/api/authService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      await authService.login(username, password);
      await checkAuth();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      // After registration, login automatically
      await login(userData.username, userData.password);
      return { success: true };
    } catch (error) {
      // Handle structured validation errors from backend
      if (typeof error === 'object' && !error.message) {
        return {
          success: false,
          error: error, // Return validation errors object
        };
      }
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  // Show loading spinner during initial auth check
  if (loading) {
    return <LoadingSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



