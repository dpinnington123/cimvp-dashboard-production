import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { updateCurrentUserMetadata } from '@/utils/updateExistingUsers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const navigate = useNavigate();

  // Load user data when component mounts
  useEffect(() => {
    if (user && user.user_metadata) {
      setFirstName(user.user_metadata.first_name || '');
      setLastName(user.user_metadata.last_name || '');
      // Reset any previous session errors
      setSessionError(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setSessionError(true);
      toast.error("Authentication error", { description: "You're not logged in. Please refresh the page or log in again." });
      return;
    }
    
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Missing information", { description: "Please provide both first and last name" });
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, error } = await updateCurrentUserMetadata(firstName, lastName);
      
      if (!success || error) {
        // Check if it's an auth session error
        if (error?.message?.includes('session') || error?.message?.includes('Session')) {
          setSessionError(true);
          throw new Error("Your session has expired. Please refresh the page or log in again.");
        }
        throw error || new Error("Failed to update profile");
      }
      
      toast.success("Profile Updated", { description: "Your profile information has been updated" });
      setIsSaved(true);
      
      // Reset the "saved" status after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast.error("Update Failed", { description: error.message || "Could not update profile information" });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSession = async () => {
    try {
      setLoading(true);
      // Sign out and redirect to login
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Failed to refresh session:", error);
      // Force a full page reload as a last resort
      window.location.href = '/login';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-white to-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
              
              {sessionError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle className="flex items-center">
                    Session Error
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <p>Your session has expired or is invalid. Please log in again to continue.</p>
                    <Button 
                      variant="outline" 
                      className="mt-3 flex items-center gap-2"
                      onClick={handleRefreshSession}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Log in again
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Your email address cannot be changed</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={loading || sessionError}
                          placeholder="Your first name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={loading || sessionError}
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={loading || isSaved || sessionError}
                      className={isSaved ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {loading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage; 