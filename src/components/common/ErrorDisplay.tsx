import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Using shadcn Alert
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  message?: string; // Optional custom message
  error?: Error | unknown; // Optional error object for more details
  className?: string; // Optional className prop
}

export default function ErrorDisplay({
  message = "An unexpected error occurred.", // Default message
  error,
  className
}: ErrorDisplayProps) {
  // Attempt to get a more specific message from the error object
  const errorMessage = error instanceof Error ? error.message : String(error ?? '');

  return (
    <Alert variant="destructive" className={cn("my-4", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
        {/* Optionally display more specific error details if available */}
        {error && errorMessage && <span className="block text-xs mt-1 opacity-80">{errorMessage}</span>}
      </AlertDescription>
    </Alert>
  );
} 