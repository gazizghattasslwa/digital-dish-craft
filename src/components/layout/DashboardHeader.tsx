import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Crown, 
  Zap, 
  ChevronRight,
  Menu
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function DashboardHeader({ 
  title, 
  description, 
  breadcrumbs = [], 
  children 
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const { subscriptionTier } = useSubscription();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = user?.email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'U';

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-col">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <nav className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground mb-1">
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {item.href ? (
                      <Link 
                        to={item.href} 
                        className="hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-foreground">{item.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="w-3 h-3 mx-1" />
                    )}
                  </div>
                ))}
              </nav>
            )}
            
            {/* Title */}
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 hidden sm:block">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Action buttons */}
          {children}
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge 
                    variant={subscriptionTier === 'free' ? 'secondary' : 'default'} 
                    className="w-fit text-xs mt-2"
                  >
                    {subscriptionTier === 'agency' && <Crown className="w-3 h-3 mr-1" />}
                    {subscriptionTier === 'premium' && <Zap className="w-3 h-3 mr-1" />}
                    {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/subscription">
                  <Crown className="w-4 h-4 mr-2" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
