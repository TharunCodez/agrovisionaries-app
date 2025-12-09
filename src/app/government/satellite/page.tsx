'use client';

import { Suspense, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Droplets, Eye, Info } from 'lucide-react';

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
  const [lat, setLat] = useState(25.0961);
  const [lng, setLng] = useState(85.3131);
  const [zoom, setZoom] = useState(14);
  const [dataLayer, setDataLayer] = useState<DataLayer>('trueColor');

  const CurrentDataLayer = dataLayers[dataLayer];

  const center: [number, number] = useMemo(() => [lat, lng], [lat, lng]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel: Settings */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="state">Select State</Label>
            <Select defaultValue="bihar">
              <SelectTrigger id="state">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" value={lat} onChange={e => setLat(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" value={lng} onChange={e => setLng(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data Layer</Label>
            <Tabs value={dataLayer} onValueChange={(value) => setDataLayer(value as DataLayer)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ndvi"><Leaf className="w-4 h-4 mr-2"/>NDVI</TabsTrigger>
                    <TabsTrigger value="moisture"><Droplets className="w-4 h-4 mr-2"/>Moisture</TabsTrigger>
                    <TabsTrigger value="trueColor"><Eye className="w-4 h-4 mr-2"/>True Color</TabsTrigger>
                </TabsList>
            </Tabs>
          </div>
          
          <Button className="w-full">
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
            />
          </CardContent>
        </Card>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm"><Leaf className="w-4 h-4"/> NDVI Index</CardDescription>
              <CardTitle className="text-3xl text-green-600">0.571</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground">Last updated: 12/9/2025</p>
             </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm"><Droplets className="w-4 h-4"/> Soil Moisture</CardDescription>
              <CardTitle className="text-3xl text-blue-500">54%</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground">Based on last sensor reading</p>
             </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm"><Info className="w-4 h-4"/> Status</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">Needs Review</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-xs text-muted-foreground">Anomalies detected</p>
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
             <h1 className="font-headline text-3xl font-bold">Satellite Analytics</h1>
            <Suspense fallback={<Skeleton className="h-[70vh] w-full" />}>
                <SatelliteView />
            </Suspense>
        </div>
    )
}
