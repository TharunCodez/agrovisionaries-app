'use client';
import ChatAssistantButton from '@/components/farmer/chat-assistant-button';
import FarmerBottomNav from '@/components/farmer/farmer-bottom-nav';
import { useUser } from '@/firebase';
import { setupFCM } from '@/lib/notifications';
import { useEffect } from 'react';
import Header from '@/components/layout/header';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/layout/language-switcher';
import ThemeToggle from '@/components/layout/theme-toggle';

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
      <div className="min-h-screen">
        {isDesktop ? (
            <Header />
        ) : (
            <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-end gap-2 border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
        )}
        <main className="w-full p-4 md:p-6 lg:p-8">
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
