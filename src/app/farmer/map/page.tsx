'use client';
import { Button } from "@/components/ui/button";
import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft } from "lucide-react";
import { deviceData } from "@/lib/data";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Map = dynamic(() => import('@/components/shared/map'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
});


function FarmerMap() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    
    // This would be replaced with a firestore query based on the logged-in farmer
    const userDevices = useMemo(() => deviceData.filter(d => d.farmerId === 'F001'), []);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] pb-20 md:h-[calc(100vh-4rem)] md:pb-0">
             <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft />
                </Button>
                <h1 className="font-headline text-xl font-bold">Farm Map</h1>
                <div className="w-10"></div> 
            </div>
            <div className="flex-1 rounded-lg overflow-hidden border">
                 <Map 
                    devices={userDevices} 
                    center={lat && lng ? [parseFloat(lat), parseFloat(lng)] : undefined}
                    zoom={zoom ? parseInt(zoom) : undefined}
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
    )
}
