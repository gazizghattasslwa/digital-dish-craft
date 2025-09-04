import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useEffect } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  restaurantId?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

function DashboardLayoutContent({
  title,
  description,
  breadcrumbs,
  restaurantId,
  headerActions,
  children,
}: DashboardLayoutProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar restaurantId={restaurantId} />
      
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <DashboardHeader 
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
        >
          {headerActions}
        </DashboardHeader>
        
        <main className="flex-1 overflow-auto bg-gradient-surface">
          <div className="container-fluid py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardLayoutContent {...props} />
    </SidebarProvider>
  );
}