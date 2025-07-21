import { Calendar, BarChart3, BookOpen, LogOut, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Buchungen", url: "/", icon: BookOpen },
  { title: "Kalenderübersicht", url: "/calendar", icon: Calendar },
  { title: "Statistiken", url: "/statistics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Erfolgreich abgemeldet');
    } catch (error) {
      toast.error('Fehler beim Abmelden');
    }
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r bg-card/50 backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b">
          <h2 className={`font-bold text-primary ${collapsed ? "text-xs text-center" : "text-lg"}`}>
            {collapsed ? "FW" : "Ferienwohnungen"}
          </h2>
          {!collapsed && (
            <p className="text-sm text-muted-foreground">Verwaltung</p>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          {!collapsed && user && (
            <div className="mb-3 p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 ${
              collapsed ? "px-2" : ""
            }`}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>Abmelden</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}