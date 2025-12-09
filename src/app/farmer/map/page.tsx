'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { deviceData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import StableMap from '@/components/shared/StableMap';

function FarmerMap() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom');

  const userDevices = useMemo(
    () => deviceData.filter((d) => d.farmerId === 'F001'),
    []
  );

  const defaultCenter: [number, number] =
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : [28.6139, 77.209];

  const markers = useMemo(
    () =>
      userDevices.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        name: d.name,
      })),
    [userDevices]
  );

  return (
    <div className="h-[calc(100vh-8rem)] pb-20 md:h-[calc(100vh-4rem)] md:pb-0 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <h1 className="font-headline text-xl font-bold">Farm Map</h1>
        <div className="w-10"></div>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border">
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
