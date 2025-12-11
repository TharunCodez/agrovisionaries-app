'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
import { useMediaQuery } from '@/hooks/use-media-query';

export default function Header() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const pathname = usePathname();
  const { role } = useRole();
  const { farmers } = useData();
  const { t } = useTranslation("common");
  const logout = useLogout();
  
  const farmer = farmers?.[0];

  const getPageTitle = (
    pathname: string,
    role: 'farmer' | 'government' | null,
    t: (key: string) => string
  ): string => {
    if (role === 'government') {
      if (pathname.includes('/dashboard')) return t('gov.sidebar.dashboard');
      if (pathname.includes('/devices/add')) return t('gov.devices.add.title');
      if (pathname.includes('/devices')) return t('gov.sidebar.devices');
      if (pathname.includes('/map')) return t('gov.sidebar.map');
      if (pathname.includes('/satellite')) return t('gov.sidebar.satellite');
      if (pathname.includes('/notifications')) return t('gov.sidebar.notifications');
      if (pathname.includes('/farmers/register')) return t('gov.sidebar.registerFarmer');
      if (pathname.includes('/farmers')) return t('gov.sidebar.farmers');
      if (pathname.includes('/analytics')) return t('gov.sidebar.analytics');
      if (pathname.includes('/settings')) return t('gov.sidebar.settings');
      return t('gov.portalName');
    }
    return t('dashboard');
  };

  const pageTitle = getPageTitle(pathname, role, t);

  const farmerNavItems = [
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
                <SidebarTrigger className="md:hidden" />
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
                        <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>{t('logout')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
  }

  // Farmer Header
  if (isMobile) {
      return (
        <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
            <Link href="/farmer/dashboard" className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">{t('farmerPortal')}</span>
            </Link>
            <div className='flex items-center'>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
        </div>
      )
  }
  
  return (
    <header className="hidden md:flex w-full sticky top-0 z-50 bg-background/95 backdrop-blur-sm px-6 lg:px-12 py-3 justify-between items-center border-b">
        <Link href="/farmer/dashboard" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t('farmerPortal')}</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
            {farmerNavItems.map((item) => (
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
                    <DropdownMenuLabel>{farmer?.name ?? t('myAccount')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/farmer/profile">{t('profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/farmer/settings">{t('settings')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>{t('logout')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}
