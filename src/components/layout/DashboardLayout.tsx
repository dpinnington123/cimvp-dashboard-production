// src/components/layout/DashboardLayout.tsx (Basic Structure)
import { Outlet, Link } from 'react-router-dom';
import Header from './Header'; // Create Header.tsx
import Sidebar from './Sidebar'; // Create Sidebar.tsx

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800 p-4 md:p-6">
          {/* Page content renders here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
} 