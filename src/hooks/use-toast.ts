import { toast as sonnerToast } from "sonner";
import { useCallback } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  className?: string;
};

export function useToast() {
  const toast = useCallback((props: ToastProps | string) => {
    if (typeof props === 'string') {
      sonnerToast(props);
      return;
    }

    const { title, description, variant = "default", duration = 5000 } = props;
    const options = {
      description,
      duration,
      className: variant === "destructive" ? "destructive" : "",
    };

    sonnerToast(title || "", options);
  }, []);

  return { toast };
}

// Direct toast function for use in components
// This function overloading allows for both formats:
// toast("Title") or toast("Title", { description: "desc" })
// or the older style: toast({ title: "Title", description: "desc" })
export function toast(props: ToastProps): void;
export function toast(title: string, options?: Omit<ToastProps, 'title'>): void;
export function toast(titleOrProps: string | ToastProps, options?: Omit<ToastProps, 'title'>): void {
  if (typeof titleOrProps === 'string') {
    sonnerToast(titleOrProps, options);
  } else {
    const { title, description, variant = "default", duration = 5000 } = titleOrProps;
    const toastOptions = {
      description,
      duration,
      className: variant === "destructive" ? "destructive" : "",
    };
    sonnerToast(title || "", toastOptions);
  }
} 