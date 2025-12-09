'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useData } from '@/contexts/data-context';
import { useRole } from '@/contexts/role-context';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


function FarmerMap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { devices } = useData();
  const { user } = useRole();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom');

  const userDevices = useMemo(
    () => (devices || []).filter((d) => d.farmerPhone === user?.phoneNumber),
    [devices, user]
  );

  const defaultCenter: [number, number] =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : (userDevices.length > 0 ? [userDevices[0].lat, userDevices[0].lng] : [28.6139, 77.209]);

  const markers = useMemo(
    () =>
      userDevices.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        name: d.name,
        id: d.id,
        isDevice: true,
      })),
    [userDevices]
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
          zoom={zoom ? parseInt(zoom) : 10}
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
