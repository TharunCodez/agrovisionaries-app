'use client';
import { GovDeviceTable } from "@/components/government/gov-device-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function GovernmentDevicesPage() {
    return (
        <div className="relative flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl md:text-3xl font-bold">Device Management</h1>
            </div>
            <GovDeviceTable />
            <Button asChild className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-lg">
                <Link href="/government/devices/add">
                    <Plus className="h-8 w-8" />
                    <span className="sr-only">Add Device</span>
                </Link>
            </Button>
        </div>
    );
}
