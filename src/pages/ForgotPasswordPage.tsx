import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      setSubmitted(true);
      toast.success("Reset Link Sent", { 
        description: "If an account exists with this email, you'll receive a password reset link" 
      });
    } catch (error: any) {
      console.error("Password reset request failed:", error);
      // Still show success message for security reasons (don't reveal if email exists)
      setSubmitted(true);
      toast.success("Reset Link Sent", { 
        description: "If an account exists with this email, you'll receive a password reset link" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <img src="/change_influence_logo.png" alt="Change Influence Logo" className="mb-8 h-16" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        
        {!submitted ? (
          <form onSubmit={handleResetRequest}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
              <div className="text-sm text-center">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="grid gap-6">
            <div className="text-center">
              <p className="mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your email inbox and spam folder. The link will expire in 24 hours.
              </p>
            </div>
            <Button onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 