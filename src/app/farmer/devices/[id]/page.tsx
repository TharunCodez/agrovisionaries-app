'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
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
import { useData } from '@/contexts/data-context';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

// This is now the Client Component part of the page
function DeviceDetailClientView({ deviceId }: { deviceId: string }) {
  const { devices } = useData();
  const device = useMemo(() => devices.find(d => d.id === deviceId), [devices, deviceId]);

  const [isMapOpen, setMapOpen] = useState(false);

  if (!device) {
      // Data might still be loading, or device not found.
      // notFound() can't be used in a client component that renders after initial load.
      // So we'll show a message.
       return (
         <div className="flex flex-col items-center justify-center h-full text-center">
            <Card>
                <CardHeader>
                    <CardTitle>Device Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The device with ID "{deviceId}" could not be found.</p>
                    <Button asChild variant="link">
                        <Link href="/farmer/devices">Go back to devices</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
       )
  }

  const markers = useMemo(
    () => [
      {
        lat: device.lat,
        lng: device.lng,
        name: device.name,
        id: device.id,
        isDevice: true,
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
    <div className="flex flex-col gap-6 pb-20 md:pb-6">
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <SensorCard type="temperature" value={device.temperature} />
            <SensorCard type="soil" value={device.soilMoisture} />
            <SensorCard
              type="wind"
              value={device.rssi > -85 ? 15 : 5}
            />
            <SensorCard
              type="solar"
              value={Math.round(device.rssi / -2 + 80)}
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

// This is the main page component, which is now a Server Component.
export default function FarmerDeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  // We pass the ID to the client component, which will fetch data from context.
  return <DeviceDetailClientView deviceId={id} />;
}
