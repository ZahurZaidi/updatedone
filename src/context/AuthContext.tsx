import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasCompletedAssessment: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('skincareUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      checkAssessmentStatus(userData.id);
    }
    setLoading(false);
  }, []);

  const checkAssessmentStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('skin_assessments')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (data && !error) {
        setHasCompletedAssessment(true);
      }
    } catch (error) {
      console.error('Error checking assessment status:', error);
    }
  };

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
      
      // Save to Supabase
      const { error } = await supabase
        .from('users')
        .upsert([{
          id: userData.id,
          email: userData.email,
          name: userData.name
        }]);

      if (error) throw error;
      
      localStorage.setItem('skincareUser', JSON.stringify(userData));
      setUser(userData);
      await checkAssessmentStatus(userData.id);
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
        id: Date.now().toString(), // Generate unique ID
        name: name,
        email: email,
        skinType: undefined,
        skinConcerns: [],
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('users')
        .insert([{
          id: userData.id,
          email: userData.email,
          name: userData.name
        }]);

      if (error) throw error;
      
      localStorage.setItem('skincareUser', JSON.stringify(userData));
      setUser(userData);
      setHasCompletedAssessment(false);
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
    setHasCompletedAssessment(false);
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
        hasCompletedAssessment,
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