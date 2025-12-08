import FarmerBottomNav from '@/components/farmer/farmer-bottom-nav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">{children}</main>
        <FarmerBottomNav />
      </div>
    </SidebarProvider>
  );
}
