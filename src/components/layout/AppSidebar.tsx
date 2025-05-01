import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  FileText, 
  ClipboardList, 
  Target, 
  LayoutDashboard, 
  PieChart 
} from "lucide-react";
import logo from '@/assets/ChangeInfluence-logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Navigation items
const navigationItems = [
  {
    title: "Home",
    icon: HomeIcon,
    path: "/",
  },
  {
    title: "Process Content",
    icon: FileText,
    path: "/process-content",
  },
  {
    title: "Content Reports",
    icon: ClipboardList,
    path: "/content-reports",
  },
  {
    title: "Brand Strategy",
    icon: Target,
    path: "/brand-strategy",
  },
  {
    title: "Brand Dashboard",
    icon: LayoutDashboard,
    path: "/brand-dashboard",
  },
  {
    title: "Strategic Dashboard",
    icon: PieChart,
    path: "/strategic-dashboard",
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <img src={logo} alt="Change Influence Logo" className="w-10rem h-auto m-3 mx-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                // Check if current path matches this item's path
                // For home path, only highlight if exact match
                const isActive = item.path === '/' 
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link 
                        to={item.path} 
                        className={cn(
                          "flex items-center",
                          isActive && "font-bold"
                        )}
                      >
                        <item.icon 
                          className={cn(
                            "w-4 h-4 mr-2",
                            isActive && "text-primary stroke-[2.5px]"
                          )} 
                        />
                        <span className={cn(
                          isActive && "text-primary tracking-wide"
                        )}>
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-5 bg-blue-500 rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 