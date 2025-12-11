'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import ChatAssistant from "@/components/farmer/chat-assistant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

export default function FarmerDashboardPage() {
  const { devices, farmers, isLoading: isDataLoading } = useData();
  const { t } = useTranslation();

  const isLoading = isDataLoading;
  const farmer = farmers?.[0];

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_3fr] gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="hidden lg:block">
                <Skeleton className="h-[calc(100vh-10rem)] w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('dashboard')}</h1>
             {farmer && (
                <div className="flex items-center gap-3">
                    <span className="font-semibold">{farmer.name}</span>
                    <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage src={farmer.photoUrl ?? ''} alt={farmer.name} />
                        <AvatarFallback>{farmer.name ? farmer.name.charAt(0).toUpperCase() : 'F'}</AvatarFallback>
                    </Avatar>
                </div>
            )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_3fr] gap-6 pb-20 md:pb-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                {devices && devices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="hidden lg:block lg:col-start-3">
                <div className="sticky top-4">
                    <ChatAssistant />
                </div>
            </div>
        </div>
    </div>
  );
}