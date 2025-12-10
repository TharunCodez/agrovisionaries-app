'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useData } from '@/contexts/data-context';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


function FarmerMap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { devices } = useData();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom');

  const defaultCenter: [number, number] =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : [27.1067, 88.3233]; // Jorethang, South Sikkim

  const markers = useMemo(
    () =>
      (devices || []).map((d) => ({
        lat: d.location.lat,
        lng: d.location.lng,
        name: d.nickname,
        id: d.id,
        isDevice: true,
      })),
    [devices]
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 pb-20 md:h-[calc(100vh-4rem)] md:pb-0">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <h1 className="font-headline text-xl font-bold">Farm Map</h1>
        <div className="w-10"></div>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border">
        <StableMap
          center={defaultCenter}
          zoom={zoom ? parseInt(zoom) : 12}
          markers={markers}
        />
      </div>
    </div>
  );
}

export default function FarmerMapPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[calc(100vh-8rem)] w-full" />}>
      <FarmerMap />
    </Suspense>
  );
}
