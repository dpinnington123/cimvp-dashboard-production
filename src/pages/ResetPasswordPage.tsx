import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import { toast } from "sonner";
import LoadingSpinner from '../components/common/LoadingSpinner';
import { supabase } from '../lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const { updatePassword, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Log the URL and hash for debugging
  useEffect(() => {
    console.log('Current URL:', window.location.href);
    console.log('Hash fragment:', location.hash);
    console.log('Auth state:', { user: !!user, authLoading });
  }, [location, user, authLoading]);

  // Process the reset token from URL on initial load
  useEffect(() => {
    const processResetToken = async () => {
      const hash = location.hash;
      
      // No hash or no token, and no authenticated user - invalid state
      if ((!hash || !hash.includes('access_token')) && !user && !authLoading) {
        console.log('No valid token found and no authenticated user');
        setTokenError(true);
        toast.error("Invalid reset link", {
          description: "Please request a new password reset link"
        });
        setTimeout(() => navigate('/forgot-password'), 2000);
        return;
      }
      
      // If we have a hash with tokens, try to establish a session
      if (hash && hash.includes('access_token')) {
        try {
          setLoading(true);
          console.log('Processing access token from hash');
          
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (!accessToken) {
            throw new Error('No access token found in URL');
          }
          
          console.log('Setting session with token');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (error) {
            console.error('Error setting session:', error.message);
            throw error;
          }
          
          console.log('Session established successfully:', !!data.session);
        } catch (error: any) {
          console.error('Error setting up session from URL:', error);
          setTokenError(true);
          toast.error("Invalid or expired reset link", {
            description: "Please request a new password reset link"
          });
          setTimeout(() => navigate('/forgot-password'), 2000);
        } finally {
          setLoading(false);
        }
      }
    };
    
    processResetToken();
  }, [location, navigate, authLoading, user]);

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user) {
      console.error('No authenticated user found when attempting to update password');
      toast.error("Session error", { 
        description: "Cannot reset password without a valid session" 
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", { 
        description: "Please make sure your passwords match" 
      });
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password too weak", { 
        description: "Password should be at least 6 characters long" 
      });
      return;
    }
    
    setLoading(true);
    console.log('Updating password for user:', user.email);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        console.error('Error updating password:', error.message);
        throw error;
      }
      
      console.log('Password updated successfully');
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
      setLoading(false);
    }
  };

  // Show loading spinner while processing
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Show error state
  if (tokenError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription>
              Your password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p>Please request a new password reset link.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/forgot-password')} className="w-full">
              Request New Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show success state
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

  // Default form view
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <img src="/ChangeInfluence-logo.png" alt="Change Influence Logo" className="mb-8 h-16" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter a new password for your account {user?.email ? `(${user.email})` : ''}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 