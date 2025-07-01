import { createClient } from '@supabase/supabase-js';

// Fetch environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced debugging for production
console.log('🚀 Initializing Supabase Client');
console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL present:', !!supabaseUrl);
console.log('Supabase Anon Key present:', !!supabaseAnonKey);

// Log partial URL for debugging (safely)
if (supabaseUrl) {
  const urlParts = supabaseUrl.split('.');
  console.log('Supabase URL pattern:', `${urlParts[0]}.[hidden].supabase.co`);
}

// Basic check to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `Supabase configuration error: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`;
  console.error('⚠️ ' + errorMsg);
  
  // In production, show a more user-friendly error
  if (import.meta.env.MODE === 'production') {
    console.error('Please check your deployment environment variables');
  }
  
  throw new Error(errorMsg);
}

// Create and export the Supabase client with explicit session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'change-influence-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
    debug: import.meta.env.MODE !== 'production', // Enable debug in development
  },
  global: {
    headers: {
      'x-application-name': 'change-influence-dashboard',
    },
  },
});

// Add a connection test
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Initial Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection established, session:', !!data.session);
  }
}).catch(err => {
  console.error('❌ Failed to test Supabase connection:', err);
}); 