'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LanguageSwitcher from './language-switcher';
import { useRole } from '@/contexts/role-context';
import NotificationBell from '../notifications/NotificationBell';
import ThemeToggle from './theme-toggle';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/data-context';
import { useLogout } from '@/hooks/use-logout';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { role, user } = useRole();
  const { farmers } = useData();
  const { t } = useTranslation();
  const logout = useLogout();
  
  const farmer = farmers?.[0];

  const getPageTitle = (
    pathname: string,
    role: 'farmer' | 'government' | null,
    t: (key: string) => string
  ): string => {
    if (role === 'government') {
      if (pathname.includes('/dashboard')) return 'Regional Agriculture Overview';
      if (pathname.includes('/devices')) return 'Device Management';
      if (pathname.includes('/map')) return 'Device Map';
      if (pathname.includes('/notifications')) return 'Notifications';
      if (pathname.includes('/farmers')) return 'Farmer Database';
      if (pathname.includes('/analytics')) return 'Analytics';
      if (pathname.includes('/settings')) return 'Settings';
      return 'Government Portal';
    }
    return t('dashboard');
  };

  const pageTitle = getPageTitle(pathname, role, t);

  const navItems = [
    { href: '/farmer/dashboard', label: t('dashboard') },
    { href: '/farmer/devices', label: t('devices') },
    { href: '/farmer/assistant', label: t('assistant') },
    { href: '/farmer/notifications', label: t('alerts') },
    { href: '/farmer/profile', label: t('profile') },
  ];

  if (role === 'government') {
    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-2">
                {isMobile && <SidebarTrigger />}
                <h1 className="font-headline text-lg font-semibold">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
                <NotificationBell />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/gov-avatar.png" alt="Government User"/>
                            <AvatarFallback>GV</AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
  }

  // Farmer Header
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-6 py-3 backdrop-blur-sm md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
            <Link href="/farmer/dashboard" className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Farmer Portal</span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'transition-colors hover:text-primary',
                            pathname.startsWith(item.href) ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
                <NotificationBell />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={farmer?.photoUrl ?? ''} alt={farmer?.name} />
                                <AvatarFallback>{farmer?.name ? farmer.name.charAt(0).toUpperCase() : 'F'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{farmer?.name ?? "My Account"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/farmer/profile">{t('profile')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/farmer/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>{t('logout')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </header>
  );
}
