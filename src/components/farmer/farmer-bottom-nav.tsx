'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, HardDrive, Bell, User, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationBell from '../notifications/NotificationBell';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from '../layout/language-switcher';
import ThemeToggle from '../layout/theme-toggle';

export default function FarmerBottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/farmer/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/farmer/devices', icon: HardDrive, label: t('devices') },
    { href: '/farmer/assistant', icon: BrainCircuit, label: t('assistant') },
    { href: '/farmer/notifications', icon: Bell, label: t('alerts') },
    { href: '/farmer/profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="grid h-16 grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          if (item.label === t('alerts')) {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                'flex flex-col items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive && 'text-primary'
              )}>
                <NotificationBell isMobile={true} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          }

          const isActive = pathname === item.href || (item.href !== '/farmer/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive && 'text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
