
'use client';

import { Suspense, use } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useData } from '@/contexts/data-context';
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';
import ValveControlCard from '@/components/farmer/valve-control-card';
import { useSearchParams } from 'next/navigation';
import { useRole } from '@/contexts/role-context';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

function toDate(timestamp: Timestamp | Date | undefined): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
}

function DeviceDetailClientView({ deviceId }: { deviceId: string }) {
  const { devices } = useData();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { role } = useRole();
  const [isMapOpen, setMapOpen] = useState(false);

  const device = useMemo(() => devices?.find(d => d.id === deviceId), [devices, deviceId]);

  const fromMap = searchParams.get('from') === 'map';
  const backHref = fromMap
    ? `/government/map`
    : `/government/devices`;
    
  const markers = useMemo(() => {
    if (!device) return [];
    return [
      {
        lat: device.location.lat,
        lng: device.location.lng,
        name: device.nickname,
        id: device.id,
        isDevice: true,
      },
    ];
  }, [device]);


  if (!device) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center">
            <Card>
                <CardHeader>
                    <CardTitle>Device Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The device with ID "{deviceId}" could not be found.</p>
                    <Button asChild variant="link">
                        <Link href="/government/devices">Go back to devices</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
       )
  }

  const lastUpdated = toDate(device.lastUpdated);
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });
    
  const getStatusBadgeClass = () => {
    if (!device.status) return 'bg-gray-500';
    switch (device.status.toLowerCase()) {
        case 'online': return 'bg-green-600 text-white';
        case 'offline': return 'bg-red-600 text-white';
        default: return 'bg-yellow-500 text-black';
    }
  };


  return (
    <div className="flex flex-col gap-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref}>
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className="flex-1 text-center font-headline text-xl font-bold">
          {device.nickname}
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
          <CardTitle className="text-lg">Live Sensor Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <SensorCard type="temperature" value={device.temperature} />
            <SensorCard type="soil" value={device.soilMoisture} />
            <SensorCard type="humidity" value={device.humidity} />
            <SensorCard type="rain" value={Math.random() > 0.8 ? 'Raining' : 'No Rain'} />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <WaterTank level={device.waterLevel} />
        <PumpControlCard />
        <ValveControlCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge
              className={getStatusBadgeClass()}
            >
              {t(device.status?.toLowerCase() ?? 'offline')}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground">{t('last_updated')}</span>
            <span>{timeAgo}</span>
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
                <DialogTitle>Device Location: {device.nickname}</DialogTitle>
              </DialogHeader>
              <div className="h-full w-full overflow-hidden rounded-lg">
                {isMapOpen && (
                  <div key={device.id} className="h-full w-full">
                    <StableMap
                      center={[device.location.lat, device.location.lng]}
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
             {t('surveyNumber')}: {device.surveyNumber}, {device.areaAcres} acres
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// This is the main page component, which is now a Server Component.
export default function GovernmentDeviceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = use(params);
  
  // We pass the ID to the client component, which will fetch data from context.
  return (
    <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <DeviceDetailClientView deviceId={id} />
    </Suspense>
  );
}

    