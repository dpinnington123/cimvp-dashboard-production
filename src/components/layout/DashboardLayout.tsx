// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white dark:bg-gray-900">
        {/* Sidebar included but hidden on mobile */}
        <AppSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          {/* Main content container with:
            flex-1: Takes up remaining vertical space
            overflow-x-hidden: Hides horizontal scrollbar 
            overflow-y-auto: Shows vertical scrollbar when content overflows
            bg-gray-100: Light gray background in light mode
            dark:bg-gray-800: Darker background in dark mode
            p-4: 1rem padding on all sides for mobile
            md:p-6: 1.5rem padding on larger screens
            ml-64: 16rem left margin to accommodate sidebar width */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 ml-56">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 