import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAccessToken, getAccessToken } from '../api/client';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'member';
  teamMember?: {
    id: string;
    name: string;
    role: string;
    avatarInitials: string;
    weeklyHours: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  devLogin: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    // Check for token in URL (from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setAccessToken(token);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Try to load user
    const existingToken = getAccessToken();
    if (existingToken || token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = () => {
    api.auth.login();
  };

  const devLogin = async (email: string) => {
    const response = await api.auth.devLogin(email);
    setAccessToken(response.accessToken);
    await refreshUser();
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore errors
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        devLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
