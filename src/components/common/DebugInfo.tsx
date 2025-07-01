import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export function DebugInfo() {
  const { session, loading: authLoading } = useAuth();
  const [dbTest, setDbTest] = useState<{ status: string; error?: string }>({ status: 'testing...' });
  
  useEffect(() => {
    // Test database connection with timeout
    const testConnection = async () => {
      try {
        console.log('🔍 Testing database connection...');
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout after 5s')), 5000)
        );
        
        // Race between the query and timeout
        const result = await Promise.race([
          supabase.from('brands').select('count').limit(1),
          timeoutPromise
        ]) as any;
        
        if (result.error) {
          console.error('❌ Database test failed:', result.error);
          setDbTest({ status: 'failed', error: result.error.message });
        } else {
          console.log('✅ Database test successful');
          setDbTest({ status: 'success' });
        }
      } catch (err: any) {
        console.error('❌ Database test exception:', err);
        setDbTest({ status: 'timeout', error: err.message });
      }
    };
    
    testConnection();
  }, []);
  
  // Only show in development or if there's an error
  if (import.meta.env.MODE === 'production' && dbTest.status === 'success') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Environment: {import.meta.env.MODE}</div>
        <div>Auth Loading: {authLoading ? 'Yes' : 'No'}</div>
        <div>Session: {session ? 'Active' : 'None'}</div>
        <div>User ID: {session?.user?.id?.slice(0, 8) || 'None'}</div>
        <div>DB Test: {dbTest.status}</div>
        {dbTest.error && (
          <div className="text-red-400 mt-2">
            Error: {dbTest.error}
          </div>
        )}
        <div className="mt-2 text-gray-400">
          Origin: {window.location.origin}
        </div>
      </div>
    </div>
  );
}