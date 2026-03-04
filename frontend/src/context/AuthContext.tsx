import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getApiEndpoint } from '../utils/api';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{success: boolean; isAdmin: boolean}>;
  logout: () => void;
  signUp: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>; // <-- Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
    const userId = localStorage.getItem('tagalong-user-id') || sessionStorage.getItem('tagalong-user-id');
    if (token && userId) {
      setIsAuthenticated(true);
      fetch(getApiEndpoint(`/api/users/${userId}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(async res => {
          const contentType = res.headers.get('content-type');
          if (!res.ok) {
            throw new Error('Failed to fetch user');
          }
          if (contentType && contentType.includes('application/json')) {
            return res.json();
          } else {
            throw new Error('Server did not return JSON');
          }
        })
        .then(user => {
          setCurrentUser(user);
        })
        .catch((err) => {
          console.error('Failed to fetch user on reload:', err);
          setIsAuthenticated(false);
          setCurrentUser(null);
        });
    }
  }, []);

  // Add rememberMe parameter
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{success: boolean; isAdmin: boolean}> => {
    try {
      const response = await fetch(getApiEndpoint('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return {success: false, isAdmin: false};
      const data = await response.json();
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      if (rememberMe) {
        localStorage.setItem('tagalong-token', data.token);
        localStorage.setItem('tagalong-user-id', data.user.id || data.user._id);
        sessionStorage.removeItem('tagalong-token');
        sessionStorage.removeItem('tagalong-user-id');
      } else {
        sessionStorage.setItem('tagalong-token', data.token);
        sessionStorage.setItem('tagalong-user-id', data.user.id || data.user._id);
        localStorage.removeItem('tagalong-token');
        localStorage.removeItem('tagalong-user-id');
      }
      return {success: true, isAdmin: data.user.role === 'admin'};
    } catch (error) {
      console.error('Login error:', error);
      return {success: false, isAdmin: false};
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tagalong-token');
    localStorage.removeItem('tagalong-user-id');
    sessionStorage.removeItem('tagalong-token');
    sessionStorage.removeItem('tagalong-user-id');
  };

  const signUp = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(getApiEndpoint('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Registration failed. Please try again.' };
      }
      // Optionally, auto-login after signup:
      await login(email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Something went wrong. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, signUp, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};