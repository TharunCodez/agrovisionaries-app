'use client';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";

export default function GovernmentMapPage() {
    const mapRef = useRef<HTMLIFrameElement>(null);

    const clientId = process.env.NEXT_PUBLIC_SENTINELHUB_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SENTINELHUB_CLIENT_SECRET;

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
        if (!clientId || !clientSecret) {
            console.error("Sentinel Hub credentials are not set in .env.local");
            return;
        }

        const fetchTokenAndLoadMap = async () => {
            try {
                const tokenResponse = await fetch('https://services.sentinel-hub.com/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
                });

                if (!tokenResponse.ok) {
                    throw new Error(`Failed to fetch Sentinel Hub token: ${tokenResponse.statusText}`);
                }

                const tokenData = await tokenResponse.json();
                const accessToken = tokenData.access_token;
                
                const sessionHash = getSessionHash();
                const randomLat = 28.6139 + (sessionHash % 1000) / 5000 - 0.1; // Centered around Delhi
                const randomLng = 77.2090 + (sessionHash % 1000) / 5000 - 0.1;

                if (mapRef.current) {
                    const mapUrl = `https://apps.sentinel-hub.com/eo-browser/?lat=${randomLat}&lng=${randomLng}&zoom=10&time=2023-01-01&preset=2_NATURAL_COL0R&access_token=${accessToken}`;
                    mapRef.current.src = mapUrl;
                }

            } catch (error) {
                console.error("Error setting up Sentinel Hub map:", error);
            }
        };

        fetchTokenAndLoadMap();
    }, [clientId, clientSecret]);

    if (!clientId || !clientSecret) {
        return (
             <div className="flex flex-col gap-6">
                <h1 className="font-headline text-3xl font-bold">Device Map View</h1>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">Sentinel Hub Client ID or Secret is not configured. Please add them to your .env.local file to display the map.</p>
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
