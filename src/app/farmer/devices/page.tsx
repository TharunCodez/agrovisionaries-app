'use client';
import DeviceCard from "@/components/farmer/device-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useData } from "@/contexts/data-context";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function DevicesPage() {
    const { devices, isLoading } = useData();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <div className="flex items-center justify-between">
                 <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('devices')}</h1>
                 <Button asChild>
                    {/* Note: This link might not be appropriate for a farmer, but keeping for now */}
                    <Link href="/government/devices/add">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add Device
                    </Link>
                 </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {devices && devices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
                 {(!devices || devices.length === 0) && (
                    <p className="text-muted-foreground col-span-full">{t('no_devices')}</p>
                )}
            </div>
        </div>
    );
}