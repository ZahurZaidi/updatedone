import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

class AuthService {
  // Email/Password Authentication
  async signUp(email: string, password: string, userData?: { full_name?: string; username?: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      // Create session record
      if (data.user) {
        await this.createSessionRecord(data.user.id, 'email');
      }

      return { user: data.user, session: data.session };
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Create session record
      if (data.user) {
        await this.createSessionRecord(data.user.id, 'email');
      }

      return { user: data.user, session: data.session };
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  async signOut() {
    try {
      // Mark current session as inactive
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  // Google OAuth - Fixed redirect configuration
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  // Password Reset
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  // Email Verification
  async resendEmailVerification() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('No user email found');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  // Profile Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      await this.updateUserProfile(userId, { avatar_url: data.publicUrl });

      return data.publicUrl;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  // Session Management
  async createSessionRecord(userId: string, loginMethod: 'email' | 'google' | 'github') {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          login_method: loginMethod,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error creating session record:', error);
    }
  }

  async getUserSessions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  async revokeSession(sessionId: string) {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  // Utility Methods
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      return null;
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // Account Merging for OAuth
  async linkAccount(provider: 'google' | 'github') {
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }

  async unlinkAccount(provider: 'google' | 'github') {
    try {
      const { data, error } = await supabase.auth.unlinkIdentity({
        provider
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new AuthError(error.message);
    }
  }
}

export const authService = new AuthService();
export default authService;