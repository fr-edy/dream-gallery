"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuthenticatedUser,
  getAuthenticatedUser,
  saveAuthenticatedUser,
  clearAuthenticatedUser
} from '@/lib/auth';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const authenticatedUser = getAuthenticatedUser();
    setUser(authenticatedUser);
    setIsLoading(false);
  }, []);

  const login = (userData: AuthenticatedUser) => {
    saveAuthenticatedUser(userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuthenticatedUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};