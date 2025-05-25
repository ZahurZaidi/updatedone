import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('skincareUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, we'll simulate a login
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        skinType: undefined,
        skinConcerns: [],
      };
      
      localStorage.setItem('skincareUser', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, we'll simulate a signup
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: name,
        email: email,
        skinType: undefined,
        skinConcerns: [],
      };
      
      localStorage.setItem('skincareUser', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('skincareUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};