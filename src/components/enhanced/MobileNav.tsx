import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, User, CreditCard, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = user ? [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <User className="w-5 h-5" />, label: "Restaurants", path: "/restaurant-management" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Subscription", path: "/subscription" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/settings" },
  ] : [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
    { icon: <User className="w-5 h-5" />, label: "Sign In", path: "/auth?tab=signin" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Sign Up", path: "/auth?tab=signup" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden text-white hover:bg-white/10"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[80vw] bg-card border-l shadow-glow">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="font-bold text-foreground">MenuCraft</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              {user && (
                <div className="px-6 py-4 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium text-foreground truncate">{user.email}</p>
                </div>
              )}

              {/* Menu Items */}
              <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-muted/50 transition-colors"
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer */}
              {user && (
                <div className="p-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};