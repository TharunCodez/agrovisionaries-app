'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, Share2, Settings, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deviceData } from '@/lib/data';
import { notFound } from 'next/navigation';
import SensorCard from '@/components/farmer/sensor-card';
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PumpControlCard from '@/components/farmer/pump-control-card';
import WaterTank from '@/components/farmer/water-tank';
import WeatherCard from '@/components/farmer/weather-card';
import { Skeleton } from '@/components/ui/skeleton';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function FarmerDeviceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const device = deviceData.find((d) => d.id === params.id);
  const [isMapOpen, setMapOpen] = useState(false);

  if (!device) {
    notFound();
  }

  const markers = useMemo(
    () => [
      {
        lat: device.lat,
        lng: device.lng,
        name: device.name,
      },
    ],
    [device]
  );

  const lastUpdated =
    typeof device.lastUpdated === 'string'
      ? new Date(device.lastUpdated)
      : new Date();
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/farmer/devices">
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center font-headline text-xl font-bold">
          {device.name}
        </h1>
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
            <Badge
              className={
                device.status === 'Online'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }
            >
              {device.status}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{timeAgo}</span>
          </div>
        </CardContent>
      </Card>

      <WeatherCard lat={device.lat} lng={device.lng} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <SensorCard
              type="wind"
              value={`${device.rssi > -85 ? 15 : 5} km/h`}
            />
            <SensorCard
              type="solar"
              value={`${Math.round(device.rssi / -2 + 80)}%`}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Location</CardTitle>
          <Dialog open={isMapOpen} onOpenChange={setMapOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <MapPin className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[70vh] max-w-[90vw] p-2 lg:max-w-[70vw]">
              <DialogHeader className="p-4">
                <DialogTitle>Device Location: {device.name}</DialogTitle>
              </DialogHeader>
              <div className="h-full w-full overflow-hidden rounded-lg">
                {isMapOpen && (
                  <div key={device.id} className="h-full w-full">
                    <StableMap
                      center={[device.lat, device.lng]}
                      zoom={14}
                      markers={markers}
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            {device.location}, {device.region}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
