import { useState } from "react";
import { 
  Home, 
  Store, 
  Settings, 
  Crown, 
  Zap, 
  Users, 
  BarChart3,
  Menu as MenuIcon,
  Languages,
  DollarSign,
  Upload,
  Palette
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
];

const getRestaurantItems = (restaurantId?: string) => [
  { title: "Overview", url: `/restaurant/${restaurantId}`, icon: Store },
  { title: "Menu Management", url: `/restaurant/${restaurantId}?tab=menu`, icon: MenuIcon },
  { title: "Quick Import", url: `/restaurant/${restaurantId}?tab=import`, icon: Upload },
  { title: "Branding", url: `/restaurant/${restaurantId}?tab=branding`, icon: Palette },
  { title: "Languages", url: `/restaurant/${restaurantId}?tab=languages`, icon: Languages },
  { title: "Currencies", url: `/restaurant/${restaurantId}?tab=currencies`, icon: DollarSign },
];

const settingsItems = [
  { title: "Subscription", url: "/subscription", icon: Crown },
];

export function DashboardSidebar({ restaurantId }: { restaurantId?: string }) {
  const { user } = useAuth();
  const { subscriptionTier } = useSubscription();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return currentPath === path;
    }
    return location.pathname === path;
  };

  const getNavCls = (isActiveLink: boolean) =>
    isActiveLink 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const restaurantItems = restaurantId ? getRestaurantItems(restaurantId) : [];

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-r bg-card/50 backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Brand Section */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-foreground">MenuCraft</h2>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email?.split('@')[0]}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-3">
              <Badge 
                variant={subscriptionTier === 'free' ? 'secondary' : 'default'} 
                className="text-xs"
              >
                {subscriptionTier === 'agency' && <Crown className="w-3 h-3 mr-1" />}
                {subscriptionTier === 'premium' && <Zap className="w-3 h-3 mr-1" />}
                {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </Badge>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls(isActive(item.url))}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Restaurant Management */}
        {restaurantId && (
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Restaurant
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {restaurantItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls(isActive(item.url))}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls(isActive(item.url))}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
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