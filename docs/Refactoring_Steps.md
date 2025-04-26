Here is the existing layout as example:

import React, { useState } from "react";
import { 
  BarChart3, 
  Menu, 
  PieChart,
  Target, 
  Users, 
  Home,
  Zap,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { name: "Dashboard", icon: Home, active: true },
    { name: "Campaigns", icon: Target },
    { name: "Analytics", icon: BarChart3 },
    { name: "Audience", icon: Users },
    { name: "Content", icon: PieChart },
    { name: "Performance", icon: Zap },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-brand-blue" />
            <h1 className="text-xl font-bold">Brand Compass</h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-gray-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm rounded-md transition-colors",
                    item.active
                      ? "bg-brand-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold md:hidden">Brand Compass</h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <h2 className="text-sm font-medium">Welcome back</h2>
                <p className="text-xs text-gray-500">Marketing Director</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-brand-blue text-white flex items-center justify-center">
                <span className="text-sm font-medium">MD</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
