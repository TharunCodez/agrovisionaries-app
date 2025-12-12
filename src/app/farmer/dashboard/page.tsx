'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import ChatAssistant from "@/components/farmer/chat-assistant";
import { useTranslation } from "react-i18next";

export default function FarmerDashboardPage() {
  const { devices, farmers, isLoading: isDataLoading } = useData();
  const { t } = useTranslation();

  const isLoading = isDataLoading;
  const farmer = farmers?.[0];

  if (isLoading) {
    return (
        <div className="space-y-8">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                  <Skeleton className="h-96 w-full" />
                  <Skeleton className="h-48 w-full" />
              </div>
              <div className="hidden lg:block">
                  <Skeleton className="h-[calc(100vh-10rem)] w-full" />
              </div>
          </div>
        </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-20 md:pb-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('dashboard')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-6 xl:gap-8">
                {devices && devices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {devices.map(device => (
                        <DeviceDashboardCard key={device.id} device={device} />
                      ))}
                    </div>
                ) : (
                <Card>
                    <CardHeader>
                    <CardTitle>{t('no_devices')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">{t('no_devices_desc')}</p>
                    <Button asChild className="mt-4">
                        <Link href="/farmer/devices">{t('view_devices')}</Link>
                        </Button>
                    </CardContent>
                </Card>
                )}
                <SmartAlert />
            </div>

            {/* Sticky Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                    <ChatAssistant />
                </div>
            </aside>
        </div>
    </div>
  );
}
