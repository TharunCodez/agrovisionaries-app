'use client';
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, HardDrive, Thermometer, Droplets, Waves, Rss, CloudRain, Battery, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export type Device = {
    id: string;
    name: string;
    location: string;
    status: 'Online' | 'Offline' | 'Warning' | 'Critical';
    lastUpdated: Date | string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    rssi: number;
    health: 'Good' | 'Excellent' | 'Warning' | 'Poor';
    lat: number;
    lng: number;
    waterLevel: number;
    farmerId: string;
    region: string;
};

export default function DeviceCard({ device }: { device: Device }) {
    const isOnline = device.status === 'Online';
    const router = useRouter();

    const lastUpdated = typeof device.lastUpdated === 'string' ? new Date(device.lastUpdated) : new Date();
    const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

    const getHealthBadgeClass = () => {
        switch (device.health) {
            case 'Excellent': return 'bg-green-600';
            case 'Good': return 'bg-blue-500';
            case 'Warning': return 'bg-yellow-500';
            case 'Poor': return 'bg-red-600';
            default: return 'bg-gray-400';
        }
    };
    
    const getStatusBadgeClass = () => {
        switch (device.status) {
            case 'Online': return 'bg-green-600';
            case 'Warning': return 'bg-yellow-500 text-black';
            case 'Critical': return 'bg-orange-600';
            case 'Offline': return 'bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Card className="p-4 transition-all hover:bg-card/90 hover:shadow-lg bg-card text-card-foreground">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <Link href={`/farmer/devices/${device.id}`} className="block">
                        <div className="flex items-center gap-3 mb-2">
                             <HardDrive className={cn("h-6 w-6", isOnline ? 'text-primary' : 'text-muted-foreground')} />
                             <div>
                                <h3 className="font-bold text-lg">{device.name}</h3>
                                <p className="text-xs text-muted-foreground">{device.id}</p>
                             </div>
                        </div>
                    </Link>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-4">
                        <div className="flex items-center gap-2" title="Temperature">
                            <Thermometer className="h-5 w-5 text-red-400" />
                            <span>{device.temperature}°C</span>
                        </div>
                         <div className="flex items-center gap-2" title="Humidity">
                            <Droplets className="h-5 w-5 text-blue-400" />
                            <span>{device.humidity}%</span>
                        </div>
                         <div className="flex items-center gap-2" title="Soil Moisture">
                            <Waves className="h-5 w-5 text-green-400" />
                            <span>{device.soilMoisture}%</span>
                        </div>
                         <div className="flex items-center gap-2" title="LoRa RSSI">
                            <Rss className="h-5 w-5 text-purple-400" />
                            <span>{device.rssi} dBm</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                     <Badge variant={'default'} className={cn('text-white', getStatusBadgeClass())}>
                        {device.status}
                    </Badge>
                     <Badge className={cn(getHealthBadgeClass(), 'text-white')}>{device.health}</Badge>
                     <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
                </div>
            </div>
             <div className="flex justify-end items-center mt-4 border-t border-border pt-3">
                <Link href={`/farmer/devices/${device.id}`} passHref>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
