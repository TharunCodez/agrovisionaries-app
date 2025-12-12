'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, BellRing } from "lucide-react";
import NotificationList from './NotificationList';
import { listenForNotifications, type AppNotification } from '@/lib/notifications';
import { useRole } from '@/contexts/role-context';
import { cn } from '@/lib/utils';

export default function NotificationBell({ isMobile = false }: { isMobile?: boolean }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useRole();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenForNotifications(user.uid, (newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optimistically mark all as read
      const newNotifications = notifications.map(n => ({...n, read: true}));
      setNotifications(newNotifications);
      setUnreadCount(0);
    }
  }

  const hasUnread = unreadCount > 0;

  if (isMobile) {
    return (
       <div className="relative">
        {hasUnread && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </div>
          )}
          {hasUnread ? <BellRing className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          {hasUnread && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </div>
          )}
          {hasUnread ? <BellRing className="h-5 w-5 animate-pulse" /> : <Bell className="h-5 w-5" />}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 md:w-96" align="end">
        <NotificationList notifications={notifications} />
      </PopoverContent>
    </Popover>
  );
}
