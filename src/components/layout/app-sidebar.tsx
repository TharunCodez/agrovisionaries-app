'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  HardDrive,
  BarChart,
  LayoutDashboard,
  Leaf,
  LogOut,
  Map,
  Settings,
  Users,
  Satellite,
  UserPlus,
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
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/hooks/use-logout';

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const logout = useLogout();

  const governmentMenuItems = [
    { href: '/government/dashboard', label: t('gov.sidebar.dashboard'), icon: LayoutDashboard },
    { href: '/government/devices', label: t('gov.sidebar.devices'), icon: HardDrive },
    { href: '/government/map', label: t('gov.sidebar.map'), icon: Map },
    { href: '/government/satellite', label: t('gov.sidebar.satellite'), icon: Satellite },
    { href: '/government/notifications', label: t('gov.sidebar.notifications'), icon: Bell },
    { href: '/government/farmers', label: t('gov.sidebar.farmers'), icon: Users },
    { href: '/government/farmers/register', label: t('gov.sidebar.registerFarmer'), icon: UserPlus },
    { href: '/government/analytics', label: t('gov.sidebar.analytics'), icon: BarChart },
    { href: '/government/settings', label: t('gov.sidebar.settings'), icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-lg font-bold">{t('gov.sidebar.title')}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {governmentMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/government/dashboard' && pathname.startsWith(item.href))}
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
              <SidebarMenuButton asChild variant="outline" onClick={logout}>
                <Link href="#">
                  <LogOut />
                  <span>{t('logout')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
