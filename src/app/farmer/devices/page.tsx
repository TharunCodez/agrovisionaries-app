'use client';
import DeviceCard, { type Device } from "@/components/farmer/device-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { deviceData } from "@/lib/data"; // Using mock data for now
import { useUser } from "@/hooks/use-user"; // Will be used for real data

export default function DevicesPage() {
    // This would be replaced with a firestore query based on the logged-in farmer
    const userDevices = deviceData.filter(d => d.farmerId === 'F001');

    return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <div className="flex items-center justify-between">
                 <h1 className="font-headline text-2xl md:text-3xl font-bold">My Devices</h1>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Device
                 </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {userDevices.map(device => (
                    <DeviceCard key={device.id} device={device as Device} />
                ))}
            </div>
        </div>
    );
}
