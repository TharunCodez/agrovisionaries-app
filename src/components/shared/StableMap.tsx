'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Device } from '../farmer/device-card';

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
}

interface StableMapProps {
    center: [number, number];
    zoom: number;
    markers?: MarkerData[];
}

export default function StableMap({ center, zoom, markers }: StableMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window === 'undefined') {
        return;
    }

    // Destroy previous map instance if it exists
    if (mapRef.current !== null) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize the map on the 'map-root' div
    mapRef.current = L.map('map-root', {
      center,
      zoom,
      zoomControl: true,
    });

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Add markers to the map
    markers?.forEach((m) => {
      L.marker([m.lat, m.lng]).addTo(mapRef.current!)
        .bindPopup(`<b>${m.name}</b>`);
    });

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div id="map-root" style={{ width: '100%', height: '100%' }} />
  );
}
