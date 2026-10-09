import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shopease_token'));
  const [loading, setLoading] = useState(true);

  // Load user on startup if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('shopease_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch (err) {
        console.error('Failed to authenticate session:', err.message);
        localStorage.removeItem('shopease_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('shopease_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('shopease_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('shopease_token');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = async (updateData) => {
    const data = await authService.updateProfile(updateData);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
