'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl, WMSTileLayer } from 'react-leaflet';
import { LatLngExpression, Icon, point } from 'leaflet';
import { Button } from '@/components/ui/button';
import { HardDrive, Thermometer, Waves, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

type Device = {
    id: string;
    name: string;
    location: string;
    status: 'Online' | 'Offline' | 'Warning' | 'Critical';
    lat: number;
    lng: number;
    temperature: number;
    soilMoisture: number;
    rssi: number;
};

interface MapProps {
    devices: Device[];
    center?: [number, number];
    zoom?: number;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Online': return '#22c55e'; // green-500
        case 'Warning': return '#f59e0b'; // amber-500
        case 'Critical': return '#ea580c'; // orange-600
        case 'Offline': return '#ef4444'; // red-500
        default: return '#6b7280'; // gray-500
    }
};

const createMarkerIcon = (status: string) => {
    const color = getStatusColor(status);
    return new Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-8 w-8">
                <path fill-opacity="0.8" fill="${color}" stroke="#fff" stroke-width="1.5" d="M16 3 C9.9248678 3 5 7.9248678 5 14 C5 22.285714 16 31 16 31 C16 31 27 22.285714 27 14 C27 7.9248678 22.075132 3 16 3 Z"></path>
                <circle cx="16" cy="14" r="4" fill="white"/>
            </svg>
        `)}`,
        iconSize: point(32, 32),
        iconAnchor: point(16, 32),
        popupAnchor: point(0, -32),
    });
};

export default function ClientMap({ devices, center, zoom = 10 }: MapProps) {
    const router = useRouter();

    const defaultCenter: LatLngExpression = center || (devices.length > 0
        ? [devices[0].lat, devices[0].lng]
        : [28.6139, 77.209]);

    const handleViewDetails = (deviceId: string) => {
        router.push(`/farmer/devices/${deviceId}`);
    };
    
    return (
        <MapContainer center={defaultCenter} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite View">
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay name="NDVI Layer (Sentinel Hub)">
                    <WMSTileLayer
                        url="https://services.sentinel-hub.com/ogc/wms/bd994a73-a8e1-48cf-959c-4e8998246537"
                        params={{
                            layers: 'NDVI',
                            format: 'image/png',
                            transparent: true,
                        }}
                        attribution='&copy; <a href="https://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>'
                    />
                </LayersControl.Overlay>
            </LayersControl>

            {devices.map(device => (
                <Marker key={device.id} position={[device.lat, device.lng]} icon={createMarkerIcon(device.status)}>
                    <Popup>
                        <div className="w-[250px]">
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive className={cn("h-5 w-5", device.status === 'Online' ? 'text-primary' : 'text-muted-foreground')} />
                                <h3 className="font-bold text-md">{device.name}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">{device.location}</div>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs mb-3 text-center">
                                <div className="flex flex-col items-center p-1 bg-muted/50 rounded-md">
                                    <Thermometer className="h-4 w-4 text-red-500" />
                                    <span className="font-bold mt-1">{device.temperature}°C</span>
                                </div>
                                <div className="flex flex-col items-center p-1 bg-muted/50 rounded-md">
                                    <Waves className="h-4 w-4 text-green-600" />
                                    <span className="font-bold mt-1">{device.soilMoisture}%</span>
                                </div>
                                <div className="flex flex-col items-center p-1 bg-muted/50 rounded-md">
                                    <Rss className="h-4 w-4 text-purple-500" />
                                    <span className="font-bold mt-1">{device.rssi}</span>
                                </div>
                            </div>

                            <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewDetails(device.id)}
                            >
                                View Details
                            </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}