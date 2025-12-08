'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  HardDrive,
  Landmark,
  LayoutDashboard,
  Leaf,
  LogOut,
  Map,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const governmentMenuItems = [
  { href: '/government/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/government/devices', label: 'Devices', icon: HardDrive },
  { href: '/government/map', label: 'Map View', icon: Map },
  { href: '/government/notifications', label: 'Notifications', icon: Bell },
  { href: '/government/farmers', label: 'Farmer Database', icon: Landmark },
  { href: '/government/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-lg font-bold">Agro Visionaries</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {governmentMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
              <SidebarMenuButton asChild variant="outline">
                <Link href="/">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
