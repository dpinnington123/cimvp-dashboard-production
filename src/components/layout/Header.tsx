// src/components/layout/Header.tsx
import { useAuth } from '../../hooks/useAuth'; // Relative path
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
// We'll add page title logic and user menu later

export default function Header() {
  const { signOut, user } = useAuth(); // Get signOut and user

  const handleLogout = async () => {
    console.log("Signing out...");
    const { error } = await signOut();
    if (error) {
      console.error("Logout failed:", error);
      // Optional: Add toast notification for logout failure
    }
    // Redirect is handled by AppRoutes/useAuth listener
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hidden md:flex" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Marketing Intelligence</h1>
        </div>
        <div className="flex items-center space-x-4">
            {user && <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>} {/* Display user email */} 
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
} 