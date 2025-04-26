import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import { toast } from "sonner";
import CheckEmailPage from './CheckEmailPage';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupCompleted, setSignupCompleted] = useState(false);
  const { signUp } = useAuth();

  // Show the check email page after successful signup
  if (signupCompleted) {
    return <CheckEmailPage />;
  }

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", { description: "Please make sure your passwords match" });
      return;
    }
    
    // Validate password strength (optional)
    if (password.length < 6) {
      toast.error("Password too weak", { description: "Password should be at least 6 characters long" });
      return;
    }
    
    setLoading(true);

    try {
      const { error, data } = await signUp(email, password);
      if (error) throw error;
      
      toast.success("Sign Up Successful", { 
        description: "Please check your email to confirm your account" 
      });
      
      // Set state to show the check email page
      setSignupCompleted(true);
    } catch (error: any) {
      console.error("Sign up failed:", error);
      toast.error("Sign Up Failed", { 
        description: error.message || "Could not create account" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirm-password">Confirm Password</Label>
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
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 