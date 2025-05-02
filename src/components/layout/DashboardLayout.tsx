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
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 ml-64">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 