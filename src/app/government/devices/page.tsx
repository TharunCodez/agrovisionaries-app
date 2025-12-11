'use client';
import { GovDeviceTable } from "@/components/government/gov-device-table";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import '@/lib/i18n/client';

export default function GovernmentDevicesPage() {
    const { t } = useTranslation("common");
    return (
        <div className="relative flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.devices.title')}</h1>
                 <Button asChild>
                    <Link href="/government/devices/add">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        {t('gov.devices.addDeviceButton')}
                    </Link>
                 </Button>
            </div>
            <GovDeviceTable />
            <Button asChild className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-lg md:hidden">
                <Link href="/government/devices/add">
                    <Plus className="h-8 w-8" />
                    <span className="sr-only">{t('gov.devices.addDeviceButton')}</span>
                </Link>
            </Button>
        </div>
    );
}
