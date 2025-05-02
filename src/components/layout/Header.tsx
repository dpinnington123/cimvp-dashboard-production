// src/components/layout/Header.tsx
import { useAuth } from '../../hooks/useAuth'; // Relative path
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import logoImage from '@/assets/ChangeInfluence-logo.png';
// We'll add page title logic and user menu later

export default function Header() {
  const { signOut, user } = useAuth(); // Get signOut and user
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Signing out...");
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed", { description: error.message });
        
        // If we have an auth session error, force navigation to login anyway
        if (error.message?.includes('Auth session missing')) {
          console.log("Auth session missing, forcing navigation to login page");
          navigate('/login', { replace: true });
        }
      } else {
        // On successful logout
        toast.success("Logged out successfully");
        navigate('/login', { replace: true });
      }
    } catch (e) {
      console.error("Unexpected logout error:", e);
      toast.error("Unexpected error during logout");
      // Force navigation to login as a fallback
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoImage} alt="Change Influence" className="h-8" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
            {user && <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>} {/* Display user email */} 
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
} 