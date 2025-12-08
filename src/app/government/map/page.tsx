'use client';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { getSentinelHubToken } from "@/lib/actions";

export default function GovernmentMapPage() {
    const mapRef = useRef<HTMLIFrameElement>(null);
    const [mapError, setMapError] = useState<string | null>(null);

    // A simple hash function to create a slightly different map for each session
    const getSessionHash = () => {
        const date = new Date().toISOString();
        let hash = 0;
        for (let i = 0; i < date.length; i++) {
            const char = date.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; 
        }
        return Math.abs(hash);
    };

    useEffect(() => {
        const fetchTokenAndLoadMap = async () => {
            try {
                const tokenResult = await getSentinelHubToken();

                if (tokenResult.error || !tokenResult.access_token) {
                    throw new Error(tokenResult.error || "Failed to retrieve Sentinel Hub access token.");
                }
                
                const accessToken = tokenResult.access_token;
                const sessionHash = getSessionHash();
                const randomLat = 28.6139 + (sessionHash % 1000) / 5000 - 0.1; // Centered around Delhi
                const randomLng = 77.2090 + (sessionHash % 1000) / 5000 - 0.1;

                if (mapRef.current) {
                    const mapUrl = `https://apps.sentinel-hub.com/eo-browser/?lat=${randomLat}&lng=${randomLng}&zoom=10&time=2023-01-01&preset=2_NATURAL_COL0R&access_token=${accessToken}`;
                    mapRef.current.src = mapUrl;
                }

            } catch (error: any) {
                console.error("Error setting up Sentinel Hub map:", error);
                setMapError(error.message);
            }
        };

        fetchTokenAndLoadMap();
    }, []);

    if (mapError) {
        return (
             <div className="flex flex-col gap-6">
                <h1 className="font-headline text-3xl font-bold">Device Map View</h1>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">{mapError}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-12rem)]">
            <h1 className="font-headline text-3xl font-bold">Device Map View</h1>
            <Card className="flex-1">
                <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                    <iframe
                        ref={mapRef}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Sentinel Hub EO Browser"
                    ></iframe>
                </CardContent>
            </Card>
        </div>
    );
}
