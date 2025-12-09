'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deviceData, farmerData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useState, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, HardDrive, Waves, Thermometer, CloudRain, Rss, Battery, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';


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

export function GovDeviceTable() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const router = useRouter();

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleViewOnMap = (e: React.MouseEvent, lat: number, lng: number) => {
        e.stopPropagation();
        router.push(`/government/map?lat=${lat}&lng=${lng}&zoom=18`);
    };

    const devicesWithFarmer = deviceData.map(device => {
        const farmer = farmerData.find(f => f.id === device.farmerId);
        const lastUpdated = typeof device.lastUpdated === 'string' ? new Date(device.lastUpdated) : new Date();
        const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });
        return {
            ...device,
            farmerName: farmer?.name || 'N/A',
            lastUpdated: timeAgo,
        };
    });

  return (
    <Card>
        <CardHeader>
            <CardTitle>All Registered Devices</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {devicesWithFarmer.map((device) => {
                    const isExpanded = expandedRow === device.id;

                    return (
                        <Fragment key={device.id}>
                            <TableRow onClick={() => toggleRow(device.id)} className="cursor-pointer">
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </TableCell>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-muted-foreground"/>
                                    {device.id}
                                </TableCell>
                                <TableCell>{device.farmerName}</TableCell>
                                <TableCell>{device.region}</TableCell>
                                <TableCell>{device.location}</TableCell>
                                <TableCell>{device.lastUpdated}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={cn("text-white", getStatusBadge(device.status))}>{device.status}</Badge>
                                </TableCell>
                            </TableRow>
                            <AnimatePresence>
                            {isExpanded && (
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={7}>
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-lg">Live Sensor Readings</h4>
                                                    <Button variant="outline" size="sm" onClick={(e) => handleViewOnMap(e, device.lat, device.lng)}>
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        Show on Map
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                    <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                        <Waves className="h-7 w-7 text-blue-500 mb-2"/>
                                                        <p className="text-lg font-bold">{device.waterLevel}%</p>
                                                        <p className="text-xs text-muted-foreground">Water Level</p>
                                                    </Card>
                                                    <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                        <Waves className="h-7 w-7 text-green-600 mb-2"/>
                                                        <p className="text-lg font-bold">{device.soilMoisture}%</p>
                                                        <p className="text-xs text-muted-foreground">Soil Moisture</p>
                                                    </Card>
                                                    <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                        <Thermometer className="h-7 w-7 text-red-500 mb-2"/>
                                                        <p className="text-lg font-bold">{device.temperature}°C</p>
                                                        <p className="text-xs text-muted-foreground">Temperature</p>
                                                    </Card>
                                                     <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                        <Droplets className="h-7 w-7 text-sky-500 mb-2"/>
                                                        <p className="text-lg font-bold">{device.humidity}%</p>
                                                        <p className="text-xs text-muted-foreground">Humidity</p>
                                                    </Card>
                                                    <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                        <Rss className="h-7 w-7 text-purple-500 mb-2"/>
                                                        <p className="text-lg font-bold">{device.rssi} dBm</p>
                                                        <p className="text-xs text-muted-foreground">LoRa RSSI</p>
                                                    </Card>
                                                     <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                        <Battery className="h-7 w-7 text-yellow-500 mb-2"/>
                                                        <p className="text-lg font-bold">{Math.round(device.rssi/-2 + 80)}%</p>
                                                        <p className="text-xs text-muted-foreground">Battery</p>
                                                    </Card>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </TableCell>
                                </TableRow>
                            )}
                            </AnimatePresence>
                        </Fragment>
                    )
                })}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
