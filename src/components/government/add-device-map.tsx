'use client';

import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@/contexts/theme-provider';

// Fix for marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface AddDeviceMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialCenter?: [number, number];
}

export default function AddDeviceMap({ onLocationSelect, initialCenter = [27.1067, 88.3233] }: AddDeviceMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (mapRef.current === null && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: true,
      });

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng).addTo(mapRef.current!);
        }
        onLocationSelect(lat, lng);
      });
    }

    // Set tile layer based on theme
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    });

    const lightLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const map = mapRef.current;
    if (map) {
      if (theme === 'dark') {
        if (!map.hasLayer(darkLayer)) {
            map.eachLayer(l => l instanceof L.TileLayer && map.removeLayer(l));
            darkLayer.addTo(map);
        }
      } else {
        if (!map.hasLayer(lightLayer)) {
            map.eachLayer(l => l instanceof L.TileLayer && map.removeLayer(l));
            lightLayer.addTo(map);
        }
      }
    }

    // No map removal on cleanup to preserve state on dialog close/reopen
    // return () => {
    //   if (mapRef.current) {
    //     mapRef.current.remove();
    //     mapRef.current = null;
    //   }
    // };
  }, [initialCenter, onLocationSelect, theme]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
}
