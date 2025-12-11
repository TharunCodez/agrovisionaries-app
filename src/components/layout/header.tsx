'use client';

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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LanguageSwitcher from './language-switcher';
import { useRole } from '@/contexts/role-context';
import NotificationBell from '../notifications/NotificationBell';
import ThemeToggle from './theme-toggle';

function getPageTitle(
  pathname: string,
  role: 'farmer' | 'government' | null
): string {
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
  if (role === 'farmer') {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/devices')) return 'My Devices';
    if (pathname.includes('/map')) return 'Farm Map';
    if (pathname.includes('/notifications')) return 'Alerts';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Farmer Portal';
  }
  return 'Agro Visionaries';
}

export default function Header() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { role } = useRole();
  const pageTitle = getPageTitle(pathname, role);

  const avatarImage = PlaceHolderImages.find(
    (img) => img.id === (role === 'farmer' ? 'farmer-avatar' : 'gov-avatar')
  );
  const avatarFallback = role === 'farmer' ? 'FP' : 'GV';

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
                {avatarImage && (
                  <AvatarImage
                    src={avatarImage.imageUrl}
                    alt="User Avatar"
                    data-ai-hint={avatarImage.imageHint}
                  />
                )}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
