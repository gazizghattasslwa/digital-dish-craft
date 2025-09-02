import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

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

export function DashboardLayout({
  title,
  description,
  breadcrumbs,
  restaurantId,
  headerActions,
  children
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar restaurantId={restaurantId} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
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
    </SidebarProvider>
  );
}