'use client';

import PumpControlCard from "@/components/farmer/pump-control-card";
import WaterTank from "@/components/farmer/water-tank";
import WeatherCard from "@/components/farmer/weather-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Share2, Settings, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deviceData } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import SensorCard from "@/components/farmer/sensor-card";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const Map = dynamic(() => import('@/components/shared/map'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
});

export default function FarmerDeviceDetailPage({ params }: { params: { id: string } }) {
    const device = deviceData.find(d => d.id === params.id);
    const router = useRouter();

    if (!device) {
        notFound();
    }
    
    const devices = useMemo(() => [device], [device]);

    const lastUpdated = typeof device.lastUpdated === 'string' ? new Date(device.lastUpdated) : new Date();
    const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/farmer/devices">
                        <ChevronLeft />
                    </Link>
                </Button>
                <h1 className="font-headline text-xl font-bold text-center flex-1">{device.name}</h1>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                        <Share2 />
                    </Button>
                     <Button variant="ghost" size="icon">
                        <Settings />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Device Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={device.status === 'Online' ? "bg-green-600" : "bg-red-600"}>{device.status}</Badge>
                    </div>
                     <div className="flex items-center justify-between mt-2">
                        <span className="text-muted-foreground">Last updated</span>
                        <span>{timeAgo}</span>
                    </div>
                </CardContent>
            </Card>

            <WeatherCard lat={device.lat} lng={device.lng} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WaterTank level={device.waterLevel} />
                <PumpControlCard />
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Live Sensor Readings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <SensorCard type="temperature" value={`${device.temperature}°C`} />
                        <SensorCard type="soil" value={`${device.soilMoisture}%`} />
                        <SensorCard type="humidity" value={`${device.humidity}%`} />
                        <SensorCard type="rssi" value={`${device.rssi} dBm`} />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Location</CardTitle>
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground mb-4">
                        {device.location}, {device.region}
                    </div>
                    <div className="h-[400px] w-full rounded-lg overflow-hidden">
                        <Map devices={devices} />
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
