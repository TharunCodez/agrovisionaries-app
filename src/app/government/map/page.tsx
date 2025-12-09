'use client';
import { Button } from '@/components/ui/button';
import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { deviceData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


function GovernmentMap() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom');

  const allDevices = useMemo(() => deviceData, []);

  const defaultCenter: [number, number] =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : [28.6139, 77.209];

  const markers = useMemo(
    () =>
      allDevices.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        name: d.name,
        id: d.id,
        isDevice: true,
      })),
    [allDevices]
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 pb-4 md:h-[calc(100vh-4rem)] md:pb-0">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <h1 className="font-headline text-xl font-bold">Device Map View</h1>
        <div className="w-10"></div>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border">
        <StableMap
          center={defaultCenter}
          zoom={zoom ? parseInt(zoom) : 10}
          markers={markers}
        />
      </div>
    </div>
  );
}

export default function GovernmentMapPage() {
  return (
    <Suspense fallback={<Skeleton className="h-full w-full" />}>
      <GovernmentMap />
    </Suspense>
  );
}
