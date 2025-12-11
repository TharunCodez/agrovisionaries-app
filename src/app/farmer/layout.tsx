'use client';
import ChatAssistantButton from '@/components/farmer/chat-assistant-button';
import FarmerBottomNav from '@/components/farmer/farmer-bottom-nav';
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
    <div className="min-h-screen">
      <main className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
      </main>
      <ChatAssistantButton />
      <FarmerBottomNav />
    </div>
  );
}