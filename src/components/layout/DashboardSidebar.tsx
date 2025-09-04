import { 
  Home, 
  Store, 
  Crown, 
  Menu as MenuIcon,
  Languages,
  DollarSign,
  Upload,
  Palette,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

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

interface DashboardSidebarProps {
  restaurantId?: string;
}

export function DashboardSidebar({ restaurantId }: DashboardSidebarProps) {
  const { user } = useAuth();
  const { subscriptionTier } = useSubscription();
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const open = state === 'open';

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return currentPath === path;
    }
    return location.pathname === path;
  };

  const getNavCls = (isActiveLink: boolean) =>
    isActiveLink
      ? "bg-primary/10 text-primary font-semibold"
      : "text-gray-400 hover:bg-gray-700 hover:text-white";

  const restaurantItems = restaurantId ? getRestaurantItems(restaurantId) : [];

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "md:w-16" : "md:w-64"} w-64`}>
        <div className="flex flex-col flex-grow">
          {/* Brand Section */}
          <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed && (
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-lg">MenuCraft</h2>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex hover:bg-gray-700">
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>

          {/* User Section */}
          <div className={`p-4 border-t border-b border-gray-700/50 ${collapsed ? "hidden" : "block"}`}>
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <Badge 
                  variant={subscriptionTier === 'free' ? 'secondary' : 'default'} 
                  className="text-xs mt-2"
                >
                  {subscriptionTier === 'agency' && <Crown className="w-3 h-3 mr-1" />}
                  {subscriptionTier === 'premium' && <Zap className="w-3 h-3 mr-1" />}
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
              </Badge>
          </div>

          {/* Main Navigation */}
          <nav className="flex-grow p-2 space-y-2">
            <h3 className={`px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${collapsed ? "text-center" : ""}`}>
              {collapsed ? "" : "Main"}
            </h3>
            {mainItems.map((item) => (
              <NavLink 
                key={item.title}
                to={item.url} 
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${getNavCls(isActive(item.url))}`}
                title={item.title}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}

            {restaurantId && (
              <>
              <h3 className={`px-4 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${collapsed ? "text-center" : ""}`}>
                  {collapsed ? "" : "Restaurant"}
              </h3>
              {restaurantItems.map((item) => (
                  <NavLink 
                  key={item.title}
                  to={item.url} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${getNavCls(isActive(item.url))}`}
                  title={item.title}
                  >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span>{item.title}</span>}
                  </NavLink>
              ))}
              </>
            )}
            
            <h3 className={`px-4 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${collapsed ? "text-center" : ""}`}>
              {collapsed ? "" : "Settings"}
            </h3>
            {settingsItems.map((item) => (
              <NavLink 
                key={item.title}
                to={item.url} 
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${getNavCls(isActive(item.url))}`}
                title={item.title}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-700/50 ${collapsed ? "hidden" : "block"}`}>
              <Button variant="outline" className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700">
                  Sign Out
              </Button>
          </div>
        </div>
      </aside>
    </>
  );
}