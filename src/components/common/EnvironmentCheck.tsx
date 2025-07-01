import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function EnvironmentCheck() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const useDatabaseBrands = import.meta.env.VITE_USE_DATABASE_BRANDS;
  
  const hasIssues = !supabaseUrl || !supabaseAnonKey || useDatabaseBrands !== 'true';
  
  if (!hasIssues) return null;
  
  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuration Error</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>Missing required environment variables:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {!supabaseUrl && (
            <li>VITE_SUPABASE_URL is not set</li>
          )}
          {!supabaseAnonKey && (
            <li>VITE_SUPABASE_ANON_KEY is not set</li>
          )}
          {useDatabaseBrands !== 'true' && (
            <li>VITE_USE_DATABASE_BRANDS should be set to "true" for production</li>
          )}
        </ul>
        <p className="text-sm mt-2">
          Please add these variables in your Vercel project settings.
        </p>
      </AlertDescription>
    </Alert>
  );
}