import { createClient } from '@supabase/supabase-js';

// Fetch environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Basic check to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase environment variables missing!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

// Create and export the Supabase client with explicit session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'change-influence-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit', // Changed from 'pkce' to 'implicit' - PKCE seems to be causing issues in production
  },
});

 