'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, HardDrive, Bell, Settings, Map, User, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationBell from '../notifications/NotificationBell';

const navItems = [
  { href: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/farmer/devices', icon: HardDrive, label: 'Devices' },
  { href: '/farmer/assistant', icon: BrainCircuit, label: 'Assistant' },
  { href: '/farmer/notifications', icon: Bell, label: 'Alerts' },
  { href: '/farmer/profile', icon: User, label: 'Profile' },
];

export default function FarmerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="grid h-16 grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          if (item.label === 'Alerts') {
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
