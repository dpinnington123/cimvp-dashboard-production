import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils"; // For combining class names

interface LoadingSpinnerProps {
  size?: number; // Optional size prop
  className?: string; // Optional className prop
}

export default function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
} 