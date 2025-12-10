
'use client';
import ChatAssistantButton from '@/components/farmer/chat-assistant-button';
import FarmerBottomNav from '@/components/farmer/farmer-bottom-nav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { setupFCM } from '@/lib/notifications';
import { useEffect } from 'react';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    if (user && process.env.NEXT_PUBLIC_FCM_VAPID_KEY) {
      setupFCM(user.uid);
    }
  }, [user]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">{children}</main>
        <FarmerBottomNav />
        <ChatAssistantButton />
      </div>
    </SidebarProvider>
  );
}
