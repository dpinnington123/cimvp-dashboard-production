// src/components/layout/DashboardLayout.tsx (Basic Structure)
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Create Header.tsx
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white dark:bg-gray-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 