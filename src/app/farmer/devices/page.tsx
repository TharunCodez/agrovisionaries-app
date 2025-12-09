'use client';
import DeviceCard from "@/components/farmer/device-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRole } from "@/contexts/role-context";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";

export default function DevicesPage() {
    const { user } = useRole();
    const { devices } = useData();

    // This would be replaced with a firestore query based on the logged-in farmer
    // For now, we'll use the mock user's farmer ID
    const userDevices = useMemo(() => {
        if (!user) return [];
        // In a real app, user.uid would be the source of truth.
        // We simulate this by filtering by phone number, which is known after login.
        return devices.filter(d => d.farmerPhone === user.phoneNumber);
    }, [devices, user]);

    return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <div className="flex items-center justify-between">
                 <h1 className="font-headline text-2xl md:text-3xl font-bold">My Devices</h1>
                 <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Device
                 </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {userDevices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );
}
