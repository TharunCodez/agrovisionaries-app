
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/contexts/role-context';

// This is a workaround for a known issue with Leaflet and Next.js/Webpack
// It ensures that the marker icons are loaded correctly.
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


type MarkerData = {
    lat: number;
    lng: number;
    name: string;
    id?: string;
    isDevice?: boolean;
}

interface StableMapProps {
    center: [number, number];
    zoom: number;
    markers?: MarkerData[];
    tileLayerUrl?: string;
    onMove?: (lat: number, lng: number, zoom: number) => void;
}

export default function StableMap({ center, zoom, markers, tileLayerUrl, onMove }: StableMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { role } = useRole();
  const pathname = usePathname();


  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) {
        return;
    }

    if (mapRef.current === null) {
        mapRef.current = L.map(mapContainerRef.current, {
          center,
          zoom,
          zoomControl: true,
        });

        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        const baseMaps = {
            "Street View": streetLayer,
            "Satellite View": satelliteLayer
        };

        L.control.layers(baseMaps).addTo(mapRef.current);
        
        // Default to satellite view if available, else street view
        satelliteLayer.addTo(mapRef.current);

        if (onMove) {
            mapRef.current.on('moveend', () => {
                const newCenter = mapRef.current!.getCenter();
                const newZoom = mapRef.current!.getZoom();
                onMove(newCenter.lat, newCenter.lng, newZoom);
            });
        }
    } else {
        mapRef.current.setView(center, zoom);
    }
    
    // Clear old markers
    mapRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            mapRef.current?.removeLayer(layer);
        }
    });

    markers?.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]).addTo(mapRef.current!);
      
      const portal = role || 'farmer';
      let detailUrl = `/${portal}/devices/${m.id}`;

      // This is the key change: append ?from=map if we are on a map page
      if(pathname.includes('/map')){
         detailUrl += `?from=map`;
      }
      
      let popupContent = `<b>${m.name}</b>`;
      if (m.isDevice && m.id) {
          popupContent += `<br/><a href="${detailUrl}" class="text-primary hover:underline leaflet-popup-nav-link">View Details</a>`;
      }
      
      marker.bindPopup(popupContent);

      if (m.isDevice && m.id) {
        marker.on('popupopen', () => {
            const link = document.querySelector(`a.leaflet-popup-nav-link[href="${detailUrl}"]`);
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    router.push(detailUrl);
                });
            }
        });
      }
    });

    if (tileLayerUrl && mapRef.current) {
        L.tileLayer(tileLayerUrl).addTo(mapRef.current);
    }


    // Do not remove map on cleanup to preserve state
    // return () => {
    //   if (mapRef.current) {
    //     mapRef.current.remove();
    //     mapRef.current = null;
    //   }
    // };
  }, [center, zoom, markers, router, tileLayerUrl, onMove, role, pathname]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
  );
}
