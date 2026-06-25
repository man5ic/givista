/**
 * Authentication Context
 * 
 * Provides global authentication state and functions to all components.
 * FIXED: User is now properly restored from token on page reload.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, signupUser } from '../types/api/authApi';
import api from '../types/api/apiService';
import { IUser, UserRole } from '../types/api/types';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore user from token on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserFromToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserFromToken = async (token: string) => {
    try {
      // Decode token payload to get user ID (no network call needed)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const payload = JSON.parse(atob(parts[1]));
      
      // Check token expiry
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      const userId = payload.id;

      // Fetch full user profile from backend
      const response = await api.get(`/users/${userId}`);
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<IUser> => {
    const response = await loginUser({ email, password });
    setUser(response.user);
    localStorage.setItem('authToken', response.token);
    return response.user;
  };

  const signup = async (data: SignupData) => {
    await signupUser(data);
    // After signup, automatically log in
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.id;
      const response = await api.get(`/users/${userId}`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
