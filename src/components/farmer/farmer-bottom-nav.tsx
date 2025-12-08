'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, HardDrive, Bell, Settings, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '../layout/language-switcher';

const navItems = [
  { href: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/farmer/devices', icon: HardDrive, label: 'Devices' },
  { href: '/farmer/notifications', icon: Bell, label: 'Alerts' },
  { href: '/farmer/settings', icon: Settings, label: 'Settings' },
];

export default function FarmerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
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
              <span className="text-xs font-medium sr-only">{item.label}</span>
            </Link>
          );
        })}
        <div className="flex flex-col items-center justify-center">
            <LanguageSwitcher />
        </div>
      </nav>
    </div>
  );
}
