import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import { toast } from "sonner";
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updatePassword, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check for invalid link *after* the initial auth check is done
    if (!authLoading && !user) {
      toast.error("Invalid or expired reset link", {
        description: "Please request a new password reset link"
      });
      navigate('/forgot-password');
    }
  }, [user, authLoading, navigate]);

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user) {
        toast.error("Session error", { description: "Cannot reset password without a valid session." });
        return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", { description: "Please make sure your passwords match" });
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password too weak", { description: "Password should be at least 6 characters long" });
      return;
    }
    
    setLocalLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      
      setSuccess(true);
      toast.success("Password Reset Successful", { 
        description: "Your password has been updated" 
      });
    } catch (error: any) {
      console.error("Password reset failed:", error);
      toast.error("Password Reset Failed", { 
        description: error.message || "Could not update password" 
      });
    } finally {
      setLocalLoading(false);
    }
  };

  // Show loading spinner while the initial auth check is happening
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Password Reset Complete</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p>You can now log in with your new password.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter a new password for your account {user?.email ? `(${user.email})` : ''}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordReset}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={localLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={localLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={localLoading}>
              {localLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 