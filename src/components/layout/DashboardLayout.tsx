// src/components/layout/DashboardLayout.tsx (Basic Structure)
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Create Header.tsx
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';

// Width constants from sidebar.tsx
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";

function MainContent() {
  const { state } = useSidebar();
  
  return (
    <div 
      className="flex-1 flex flex-col overflow-hidden transition-[margin] duration-200 ease-linear"
      style={{ 
        marginLeft: state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON 
      }}
    >
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white dark:bg-gray-900">
        <AppSidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
} 