import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Settings, 
  Users, 
  PieChart, 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Bell,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./Logo";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  alert,
  onClick
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 group",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
  >
    <div className="flex items-center justify-center w-7">
      {icon}
    </div>
    <span className="text-sm">{label}</span>
    {alert && (
      <span className="ml-auto h-2 w-2 rounded-full bg-sidebar-accent-foreground" />
    )}
  </button>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setSidebarVisible(!isMobile);
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleSidebarItemClick = () => {
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  const sidebarItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", active: true },
    { icon: <BarChart className="h-5 w-5" />, label: "Analytics" },
    { icon: <PieChart className="h-5 w-5" />, label: "Campaigns" },
    { icon: <Users className="h-5 w-5" />, label: "Audience" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages", alert: true },
    { icon: <Calendar className="h-5 w-5" />, label: "Schedule" },
    { icon: <Bell className="h-5 w-5" />, label: "Notifications" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isMobile 
            ? sidebarVisible ? "translate-x-0" : "-translate-x-full" 
            : sidebarOpen ? "w-64" : "w-[70px]"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border justify-between">
          {(sidebarOpen || isMobile) && <Logo variant="full" />}
          {!sidebarOpen && !isMobile && (
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md mx-auto">
              <span className="text-lg font-bold text-white">C</span>
            </div>
          )}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-sidebar-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className={cn("flex flex-col space-y-1 px-2",
            !sidebarOpen && !isMobile && "items-center")
          }>
            {sidebarItems.map((item, index) => (
              <React.Fragment key={index}>
                {!sidebarOpen && !isMobile ? (
                  <div className="tooltip-wrapper relative group">
                    <button
                      onClick={handleSidebarItemClick}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-md transition-all",
                        item.active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.icon}
                      {item.alert && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-sidebar-accent-foreground" />
                      )}
                    </button>
                    <div className="absolute left-full ml-2 pl-1 z-50 hidden group-hover:block">
                      <div className="px-3 py-2 rounded bg-popover text-popover-foreground text-sm shadow-md">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ) : (
                  <SidebarItem
                    icon={item.icon}
                    label={item.label}
                    active={item.active}
                    alert={item.alert}
                    onClick={handleSidebarItemClick}
                  />
                )}
                {index === 3 && (
                  <Separator className="my-3 mx-2 opacity-50" />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>

        {!isMobile && (
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-md bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors"
            >
              {sidebarOpen ? (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-2 text-sm">Collapse</span>
                </>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300",
          isMobile ? "ml-0" : sidebarOpen ? "lg:ml-64" : "lg:ml-[70px]"
        )}
      >
        <Navbar onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-8">
          {children}
        </main>
      </div>

      {isMobile && sidebarVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarVisible(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
