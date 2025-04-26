import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

export default function CheckEmailPage() {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        },
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent", {
        description: "Check your inbox for the verification link"
      });
    } catch (error: any) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to send verification email", {
        description: error.message || "Please try again later"
      });
    } finally {
      setResending(false);
    }
  };

  const userEmail = user?.email || "your email address";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to {userEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please click the link in the email to verify your account and complete the registration process. 
            If you don't see the email, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={handleResendVerification} 
            variant="outline" 
            className="w-full"
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              Return to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 