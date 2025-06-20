import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService, type UserProfile } from '../lib/auth';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { full_name?: string; username?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  resendEmailVerification: () => Promise<void>;
  isAuthenticated: boolean;
  hasCompletedAssessment: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
          await checkAssessmentStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
          await checkAssessmentStatus(session.user.id);
        } else {
          setProfile(null);
          setHasCompletedAssessment(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await authService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

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

  const signUp = async (email: string, password: string, userData?: { full_name?: string; username?: string }) => {
    try {
      setLoading(true);
      await authService.signUp(email, password, userData);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signIn(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update password');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedProfile = await authService.updateUserProfile(user.id, updates);
      setProfile(updatedProfile);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const avatarUrl = await authService.uploadAvatar(user.id, file);
      await refreshProfile();
      return avatarUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload avatar');
    }
  };

  const resendEmailVerification = async () => {
    try {
      await authService.resendEmailVerification();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend verification email');
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        uploadAvatar,
        resendEmailVerification,
        isAuthenticated: !!user,
        hasCompletedAssessment,
        refreshProfile,
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