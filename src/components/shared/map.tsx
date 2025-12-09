'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl, WMSTileLayer } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { deviceData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { HardDrive } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

interface MapViewProps {
  center: LatLngExpression;
  zoom: number;
  devices: typeof deviceData;
}

// Fix for default icon issue with Leaflet and Webpack
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'online':
            return 'bg-green-600 hover:bg-green-700';
        case 'warning':
            return 'bg-yellow-500 hover:bg-yellow-600 text-black';
        case 'critical':
             return 'bg-orange-600 hover:bg-orange-700';
        case 'offline':
            return 'bg-red-600 hover:bg-red-700';
        default:
            return 'bg-gray-500';
    }
}

const sentinelHubInstanceId = '9d40bbd7-7c3d-41ec-ac1b-64f2d5df4ae3';
const wmsUrl = `https://services.sentinel-hub.com/ogc/wms/${sentinelHubInstanceId}`;

export default function MapView({ center, zoom, devices }: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="True Color">
            <WMSTileLayer
                url={wmsUrl}
                params={{ layers: '1_TRUE_COLOR', format: 'image/png', transparent: true }}
            />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Crop Health (NDVI)">
            <WMSTileLayer
                url={wmsUrl}
                params={{ layers: '3_NDVI', format: 'image/png', transparent: true }}
            />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Moisture Index">
             <WMSTileLayer
                url={wmsUrl}
                params={{ layers: '5-MOISTURE-INDEX1', format: 'image/png', transparent: true }}
            />
        </LayersControl.Overlay>
      </LayersControl>

      {devices.map(device => (
        <Marker key={device.id} position={[device.lat, device.lng]} icon={defaultIcon}>
          <Popup>
            <Card className="border-none shadow-none">
                <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                        <HardDrive className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">{device.name}</h3>
                    </div>
                    <div className="text-sm space-y-1">
                        <p><strong>ID:</strong> {device.id}</p>
                        <p className='flex items-center gap-2'><strong>Status:</strong> <Badge className={cn("text-white text-xs", getStatusBadge(device.status))}>{device.status}</Badge></p>
                        <p><strong>Last Updated:</strong> {new Date(device.lastUpdated).toLocaleString()}</p>
                    </div>
                    <Button variant="link" className="p-0 h-auto mt-2" onClick={() => window.open(`/farmer/devices/${device.id}`, '_blank')}>
                        View Details
                    </Button>
                </div>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
