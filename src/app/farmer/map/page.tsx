'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { getSentinelHubToken } from "@/lib/actions";
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Layers, Minus, Plus } from "lucide-react";
import { deviceData } from "@/lib/data";

export default function FarmerMapPage() {
    const mapRef = useRef<HTMLIFrameElement>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    
    // Default to a central location if no params
    const initialLat = lat ? parseFloat(lat) : 28.6139;
    const initialLng = lng ? parseFloat(lng) : 77.2090;
    const initialZoom = zoom ? parseInt(zoom) : 10;
    
    const [view, setView] = useState({ lat: initialLat, lng: initialLng, zoom: initialZoom });

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const tokenResult = await getSentinelHubToken();
                if (tokenResult.error || !tokenResult.access_token) {
                    throw new Error(tokenResult.error || "Failed to retrieve Sentinel Hub access token.");
                }
                setToken(tokenResult.access_token);
            } catch (error: any) {
                console.error("Error setting up Sentinel Hub map:", error);
                setMapError(error.message);
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            // Construct the base URL
            let mapUrl = `https://apps.sentinel-hub.com/eo-browser/?lat=${view.lat}&lng=${view.lng}&zoom=${view.zoom}&time=2023-01-01&preset=2_NATURAL_COL0R&access_token=${token}`;
            
            // Add markers for all devices
            const markers = deviceData.map(d => `[${d.lng},${d.lat},'${d.name}']`).join(',');
            mapUrl += `&markers=[${markers}]`;

            if (mapRef.current) {
                mapRef.current.src = mapUrl;
            }
        }
    }, [token, view]);


    if (mapError) {
        return (
             <div className="flex flex-col gap-6 p-4">
                <h1 className="font-headline text-3xl font-bold">Farm Map</h1>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">{mapError}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] pb-20 md:h-[calc(100vh-4rem)] md:pb-0">
             <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft />
                </Button>
                <h1 className="font-headline text-xl font-bold">Farm Map</h1>
                <Button variant="ghost" size="icon">
                    <Layers />
                </Button>
            </div>
            <Card className="flex-1 relative">
                <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                    <iframe
                        ref={mapRef}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Sentinel Hub EO Browser"
                        className={!token ? "animate-pulse bg-muted" : ""}
                    ></iframe>
                     <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                        <Button size="icon" onClick={() => setView(v => ({...v, zoom: Math.min(20, v.zoom + 1)}))}>
                            <Plus />
                        </Button>
                         <Button size="icon" onClick={() => setView(v => ({...v, zoom: Math.max(1, v.zoom - 1)}))}>
                            <Minus />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
