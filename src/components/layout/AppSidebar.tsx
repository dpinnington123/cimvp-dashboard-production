import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  FileText, 
  ClipboardList, 
  Target, 
  LayoutDashboard, 
  PieChart 
} from "lucide-react";
import logo from '@/assets/change_influence_logo.png';
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
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <img src={logo} alt="Change Influence Logo" className="w-1/2 h-auto mb-2 mx-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 