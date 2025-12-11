'use client';
import ChatAssistantButton from '@/components/farmer/chat-assistant-button';
import FarmerBottomNav from '@/components/farmer/farmer-bottom-nav';
import { useUser } from '@/firebase';
import { setupFCM } from '@/lib/notifications';
import { useEffect } from 'react';
import Header from '@/components/layout/header';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (user && process.env.NEXT_PUBLIC_FCM_VAPID_KEY) {
      setupFCM(user.uid);
    }
  }, [user]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
        </main>
        {!isDesktop && (
          <>
            <ChatAssistantButton />
            <FarmerBottomNav />
          </>
        )}
      </div>
    </SidebarProvider>
  );
}
