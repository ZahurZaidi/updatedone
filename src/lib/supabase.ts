import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're in development and provide helpful error messages
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (isDevelopment) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    console.error('Required variables:');
    console.error('- VITE_SUPABASE_URL');
    console.error('- VITE_SUPABASE_ANON_KEY');
    console.error('Current values:', {
      VITE_SUPABASE_URL: supabaseUrl || 'NOT SET',
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET'
    });
  }
  
  if (isProduction) {
    console.error('Supabase environment variables are not configured for this deployment.');
    console.error('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment settings.');
  }
}

// Create a mock client for development/demo purposes when env vars are missing
const createMockClient = () => {
  return {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      updateUser: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      resend: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      setSession: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      linkIdentity: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      unlinkIdentity: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        })
      })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  }
}

// Create the Supabase client or mock client
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      skin_assessments: {
        Row: {
          id: string
          user_id: string
          skin_type: string
          hydration_level: string
          assessment_answers: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skin_type: string
          hydration_level: string
          assessment_answers: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skin_type?: string
          hydration_level?: string
          assessment_answers?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}