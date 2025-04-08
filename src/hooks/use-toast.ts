import { toast as sonnerToast } from "sonner";
import { useCallback } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function useToast() {
  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const options = {
      duration,
      className: variant === "destructive" ? "destructive" : "",
    };

    sonnerToast(title, {
      description,
      ...options,
    });
  }, []);

  return { toast };
} 