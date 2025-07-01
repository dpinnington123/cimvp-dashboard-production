// Debug version to test different client configurations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Test 1: Simple client without PKCE
export const supabaseSimple = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  }
});

// Test 2: Client with implicit flow instead of PKCE
export const supabaseImplicit = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    flowType: 'implicit',
    persistSession: true,
    storageKey: 'change-influence-auth-implicit',
  }
});

// Test different configurations
export async function debugSupabaseConfigs() {
  console.group('🔍 Testing different Supabase configurations');
  
  try {
    console.log('Test 1: Simple client...');
    const simpleResult = await Promise.race([
      supabaseSimple.from('brands').select('count').limit(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]);
    console.log('✅ Simple client works:', simpleResult);
  } catch (err) {
    console.error('❌ Simple client failed:', err);
  }
  
  try {
    console.log('Test 2: Implicit flow client...');
    const implicitResult = await Promise.race([
      supabaseImplicit.from('brands').select('count').limit(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]);
    console.log('✅ Implicit flow works:', implicitResult);
  } catch (err) {
    console.error('❌ Implicit flow failed:', err);
  }
  
  console.groupEnd();
}