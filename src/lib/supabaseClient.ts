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

// Add a connection test with timeout
const testConnection = async () => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Connection timeout after 5s')), 5000)
  );
  
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise
    ]);
    
    if ('error' in result && result.error) {
      console.error('❌ Initial Supabase connection test failed:', result.error.message);
      console.error('Error details:', result.error);
    } else if ('data' in result) {
      console.log('✅ Supabase connection established, session:', !!result.data.session);
    }
  } catch (err: any) {
    console.error('❌ Failed to test Supabase connection:', err.message);
    console.error('This usually indicates a CORS or network issue');
    
    // Try a simple fetch to the Supabase URL to test connectivity
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
        }
      });
      console.log('Direct API health check status:', response.status);
    } catch (fetchErr) {
      console.error('Direct API call also failed:', fetchErr);
    }
  }
};

testConnection(); 