import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  FileText, 
  Presentation, 
  Target, 
  LayoutDashboard, 
  BarChart3, 
  FileSpreadsheet, 
  Megaphone,
  ChevronDown,
  Brain,
  MessageSquare
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import * as React from 'react';

// Navigation structure with groups
const navigationStructure = [
  {
    type: 'item',
    title: "Home",
    icon: HomeIcon,
    path: "/",
  },
  {
    type: 'group',
    title: "Content",
    icon: FileText,
    headerColor: 'purple',
    defaultOpen: false,
    items: [
      {
        title: "Process Content",
        icon: FileText,
        path: "/process-content",
      },
      {
        title: "Content Reports",
        icon: Presentation,
        path: "/content-reports",
      },
    ],
  },
  {
    type: 'group',
    title: "Dashboards",
    icon: LayoutDashboard,
    headerColor: 'purple',
    defaultOpen: false,
    items: [
      {
        title: "Campaign Dashboard",
        icon: Megaphone,
        path: "/campaign-planner",
      },
      {
        title: "Brand Dashboard",
        icon: FileSpreadsheet,
        path: "/brand-dashboard",
      },
      {
        title: "Strategic Dashboard",
        icon: BarChart3,
        path: "/strategic-dashboard",
      },
    ],
  },
  {
    type: 'group',
    title: "Tools",
    icon: Brain,
    headerColor: 'purple',
    defaultOpen: false,
    items: [
      {
        title: "AI Market Research",
        icon: Brain,
        path: "/tools/ai-market-research",
      },
      {
        title: "AI Message testing",
        icon: MessageSquare,
        path: "/tools/ai-message-testing",
      },
    ],
  },
  {
    type: 'group',
    title: "Strategy / Planning",
    icon: Target,
    headerColor: 'blue',
    defaultOpen: true,
    items: [
      {
        title: "Campaign Planner",
        icon: Megaphone,
        path: "/campaign-planner",
      },
      {
        title: "Brand Strategy",
        icon: Target,
        path: "/brand-strategy",
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  // Track which groups are open
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    // Initialize with default open states
    const initial: Record<string, boolean> = {};
    navigationStructure.forEach((item) => {
      if (item.type === 'group') {
        initial[item.title] = item.defaultOpen || false;
      }
    });
    return initial;
  });

  // Check if a path is active
  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Check if any child in a group is active
  const hasActiveChild = (items: any[]) => {
    return items.some(item => isPathActive(item.path));
  };

  // Auto-expand groups with active children
  React.useEffect(() => {
    navigationStructure.forEach((navItem) => {
      if (navItem.type === 'group' && navItem.items && hasActiveChild(navItem.items)) {
        setOpenGroups(prev => ({ ...prev, [navItem.title]: true }));
      }
    });
  }, [location.pathname]);

  const renderMenuItem = (item: any, isNested = false) => {
    const isActive = isPathActive(item.path);
    
    return (
      <SidebarMenuItem key={item.path} className={!isNested ? "mb-4" : ""}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link 
            to={item.path} 
            className={cn(
              "flex items-center relative",
              isActive && "font-medium",
              isNested && "pl-4"
            )}
          >
            <item.icon 
              className={cn(
                "w-4 h-4 mr-2 shrink-0",
                isActive && "text-primary"
              )} 
            />
            <span className={cn(
              "flex-1",
              isActive && "text-primary"
            )}>
              {item.title}
            </span>
            {isActive && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-l-full" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderNavItem = (navItem: any) => {
    if (navItem.type === 'item') {
      return renderMenuItem(navItem);
    }

    if (navItem.type === 'group') {
      const isOpen = openGroups[navItem.title];
      const hasActive = navItem.items && hasActiveChild(navItem.items);

      return (
        <Collapsible
          key={navItem.title}
          open={isOpen}
          onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, [navItem.title]: open }))}
          className="mb-4"
        >
          <CollapsibleTrigger
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200",
              navItem.headerColor === 'purple' && "bg-purple-600 text-white hover:bg-purple-700",
              navItem.headerColor === 'blue' && "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <div className="flex items-center gap-2">
              <navItem.icon className="w-4 h-4" />
              <span>{navItem.title}</span>
            </div>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="mt-1">
              {navItem.items?.map((item: any) => renderMenuItem(item, true))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return null;
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <img src={logo} alt="Change Influence Logo" className="w-10rem h-auto m-3 mx-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationStructure.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 