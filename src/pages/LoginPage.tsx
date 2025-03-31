import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth'; // Changed path alias to relative
import { toast } from "sonner"; // Assuming this alias works despite linter

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPassword } = useAuth(); // Use the hook


  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await signInWithPassword({ email, password }); // Call Supabase sign in
      if (error) throw error; // Throw if Supabase returns an error
      // onAuthStateChange in useAuth will handle setting state and loading=false
      // Redirect happens in AppRoutes based on session state change
      // Optional: Show success toast here, though redirect might be fast
      toast.success("Login Successful", { description: "Redirecting..." });
      // navigate('/', { replace: true }); // Navigation now handled by AppRoutes based on session state
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error("Login Failed", { description: error.message || "Invalid credentials" });
      setLoading(false); // Ensure loading is false on error
    } 
    // No finally block needed here as loading is handled by onAuthStateChange on success, and in catch on error
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 