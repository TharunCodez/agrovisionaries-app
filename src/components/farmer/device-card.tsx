import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, HardDrive } from "lucide-react";

type Device = {
    id: string;
    name: string;
    location: string;
    status: 'Online' | 'Offline';
}

export default function DeviceCard({ device }: { device: Device }) {
    const isOnline = device.status === 'Online';
    return (
        <Link href={`/farmer/devices/${device.id}`}>
            <Card className="flex items-center p-4 transition-all hover:bg-accent">
                <div className="mr-4 rounded-full bg-muted p-3">
                    <HardDrive className={`h-6 w-6 ${isOnline ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-600' : ''}>
                        {device.status}
                    </Badge>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
            </Card>
        </Link>
    );
}
