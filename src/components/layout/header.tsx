'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
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
import { Bell } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LanguageSwitcher from './language-switcher';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/government')) return 'Government Portal';
  if (pathname.startsWith('/dashboard')) return 'Farmer Dashboard';
  if (pathname.startsWith('/devices')) return 'My Devices';
  if (pathname.startsWith('/map')) return 'Farm Map';
  if (pathname.startsWith('/notifications')) return 'Notifications';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'Agro Visionaries';
}

export default function Header() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const isFarmerView = pathname.startsWith('/dashboard');
  const avatarImage = PlaceHolderImages.find(img => img.id === (isFarmerView ? 'farmer-avatar' : 'gov-avatar'));
  const avatarFallback = isFarmerView ? 'AV' : 'GV';

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="font-headline text-lg font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" data-ai-hint={avatarImage.imageHint}/>}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
