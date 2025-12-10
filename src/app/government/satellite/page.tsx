'use client';

import { Suspense, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Droplets, Eye, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSentinelHubToken } from '@/lib/actions';

const StableMap = dynamic(() => import('@/components/shared/StableMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
});

const dataLayers = {
  trueColor: {
    label: "True Color",
    description: "True color composite showing natural colors as seen from space. Useful for identifying land use, water bodies, and urban areas.",
    icon: Eye
  },
  ndvi: {
    label: "NDVI",
    description: "Normalized Difference Vegetation Index highlights live green vegetation. Higher values indicate healthier vegetation.",
    icon: Leaf
  },
  moisture: {
    label: "Moisture",
    description: "Moisture index helps in identifying water stress in crops. It is sensitive to the total amount of water stored in the foliage.",
    icon: Droplets
  }
};

type DataLayer = keyof typeof dataLayers;

function SatelliteView() {
  const [lat, setLat] = useState(27.1067);
  const [lng, setLng] = useState(88.3233);
  const [zoom, setZoom] = useState(13);
  const [dataLayer, setDataLayer] = useState<DataLayer>('trueColor');
  const [tileUrl, setTileUrl] = useState<string | undefined>(undefined);

  const CurrentDataLayer = dataLayers[dataLayer];

  const center: [number, number] = useMemo(() => [lat, lng], [lat, lng]);

  const handleMapMove = useCallback((newLat: number, newLng: number, newZoom: number) => {
    setLat(newLat);
    setLng(newLng);
    setZoom(newZoom);
  }, []);

  const fetchSatelliteData = async () => {
    console.log("Fetching satellite data for", lat, lng);
    const { access_token, error } = await getSentinelHubToken();
    if(error || !access_token) {
        console.error("Could not fetch Sentinel token", error);
        return;
    }

    const bbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}`;

    const url = new URL('https://services.sentinel-hub.com/api/v1/process');
    url.searchParams.set('bbox', bbox);
    url.searchParams.set('width', '512');
    url.searchParams.set('height', '512');

    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: ["B02", "B03", "B04"],
          output: { bands: 3 }
        };
      }

      function evaluatePixel(sample) {
        return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
      }
    `;

    const requestBody = `
        {
            "input": {
                "bounds": { "bbox": [${lng-0.05}, ${lat-0.05}, ${lng+0.05}, ${lat+0.05}] },
                "data": [{ "type": "sentinel-2-l1c" }]
            },
            "output": { "width": 512, "height": 512 },
            "evalscript": \`${evalscript}\`
        }
    `;
    
    // For now, we will just log this. In a real app we'd fetch an image and overlay it.
    console.log("Sentinel Hub request would be:", url.toString());

    setTileUrl(`https://services.sentinel-hub.com/ogc/wms/${access_token}?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&LAYERS=TRUE-COLOR-S2-L1C&BBOX=${bbox}&WIDTH=512&HEIGHT=512&FORMAT=image/png&SRS=EPSG:4326`);

  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel: Settings */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
          <CardDescription>Centered on South Sikkim</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" value={lat.toFixed(4)} onChange={e => setLat(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" value={lng.toFixed(4)} onChange={e => setLng(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data Layer</Label>
            <Tabs value={dataLayer} onValueChange={(value) => setDataLayer(value as DataLayer)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto flex-wrap sm:flex-nowrap">
                    <TabsTrigger value="ndvi" className="flex-col sm:flex-row gap-2"><Leaf className="w-4 h-4"/>NDVI</TabsTrigger>
                    <TabsTrigger value="moisture" className="flex-col sm:flex-row gap-2"><Droplets className="w-4 h-4"/>Moisture</TabsTrigger>
                    <TabsTrigger value="trueColor" className="flex-col sm:flex-row gap-2"><Eye className="w-4 h-4"/>True Color</TabsTrigger>
                </TabsList>
            </Tabs>
          </div>
          
          <Button className="w-full" onClick={fetchSatelliteData}>
            Fetch Satellite Data
          </Button>

          {CurrentDataLayer && (
            <Card className="bg-muted/50">
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                 <CurrentDataLayer.icon className="w-6 h-6 text-primary"/>
                 <CardTitle className="text-base">{CurrentDataLayer.label} Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{CurrentDataLayer.description}</p>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>

      {/* Right Panel: Map */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="flex-1">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Satellite Map View</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">Good</Badge>
          </CardHeader>
          <CardContent className="h-[50vh] lg:h-[calc(100%-8rem)] p-0 rounded-b-lg overflow-hidden">
            <StableMap
              center={center}
              zoom={zoom}
              onMove={handleMapMove}
              tileLayerUrl={tileUrl}
            />
          </CardContent>
        </Card>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm"><Leaf className="w-4 h-4"/> NDVI Index</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-green-600">0.78</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground">For selected area</p>
             </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm"><Droplets className="w-4 h-4"/> Soil Moisture</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-blue-500">62%</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground">Aggregated from sensors</p>
             </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm"><Info className="w-4 h-4"/> Status</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-green-600">Healthy</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground">Vegetation is healthy</p>
             </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}

export default function SatellitePage() {
    return (
        <div className="flex flex-col gap-6 h-full">
             <h1 className="font-headline text-2xl md:text-3xl font-bold">Satellite Analytics</h1>
            <Suspense fallback={<Skeleton className="h-[70vh] w-full" />}>
                <SatelliteView />
            </Suspense>
        </div>
    )
}
