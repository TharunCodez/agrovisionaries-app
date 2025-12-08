import DeviceCard from "@/components/farmer/device-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const devices = [
    { id: '1', name: 'LIV-001', location: 'North Field', status: 'Online' },
    { id: '2', name: 'LIV-002', location: 'South Field', status: 'Offline' },
    { id: '3', name: 'LIV-003', location: 'West Field', status: 'Online' },
]

export default function DevicesPage() {
    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                 <h1 className="font-headline text-3xl font-bold">My Devices</h1>
                 <Button>
                    <PlusCircle className="mr-2"/>
                    Add Device
                 </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {devices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );
}
