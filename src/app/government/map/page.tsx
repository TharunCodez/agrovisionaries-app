'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from "lucide-react";
import { deviceData } from "@/lib/data";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/shared/map'), { 
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />
});

function GovernmentMap() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    
    // Default to a central location if no params, with a wider zoom for government view
    const initialLat = lat ? parseFloat(lat) : 28.6139;
    const initialLng = lng ? parseFloat(lng) : 77.2090;
    const initialZoom = zoom ? parseInt(zoom) : 5;
    
    const center = useMemo(() => [initialLat, initialLng] as [number, number], [initialLat, initialLng]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] pb-4 md:h-[calc(100vh-4rem)] md:pb-0">
             <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft />
                </Button>
                <h1 className="font-headline text-xl font-bold">Device Map View</h1>
                {/* The LayersControl in the map component now handles this */}
                <div className="w-10"></div> 
            </div>
            <Card className="flex-1 relative">
                <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                   <MapView center={center} zoom={initialZoom} devices={deviceData} />
                </CardContent>
            </Card>
        </div>
    );
}

export default function GovernmentMapPage() {
    return (
        <Suspense fallback={<Skeleton className="h-[calc(100vh-8rem)] w-full" />}>
            <GovernmentMap />
        </Suspense>
    )
}
