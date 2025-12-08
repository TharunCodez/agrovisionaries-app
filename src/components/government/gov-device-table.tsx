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
import { ChevronDown, ChevronRight, HardDrive, Waves, Thermometer, CloudRain } from "lucide-react";
import { Button } from "../ui/button";
import PumpControlCard from "../farmer/pump-control-card";


const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'online':
            return 'bg-green-600 hover:bg-green-700';
        case 'warning':
            return 'bg-yellow-500 hover:bg-yellow-600';
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

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const devicesWithFarmer = deviceData.map(device => {
        const farmer = farmerData.find(f => f.id === device.farmerId);
        return {
            ...device,
            farmerName: farmer?.name || 'N/A'
        };
    });
    
    // Simple pseudo-random data for sensors
    const getSensorData = (deviceId: string) => {
        const hash = deviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            waterLevel: (hash % 50) + 20, // 20-70%
            soilMoisture: (hash % 60) + 30, // 30-90%
            temperature: (hash % 15) + 20, // 20-35 C
            rain: (hash % 3 === 0) ? 'None' : (hash % 3 === 1) ? 'Low' : 'Medium'
        }
    }

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
                    const sensorData = getSensorData(device.id);
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
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                                                <div className="md:col-span-1">
                                                    <h4 className="font-bold mb-2">Device Controls</h4>
                                                    <PumpControlCard />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <h4 className="font-bold mb-2">Live Sensor Readings</h4>
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <Card className="flex flex-col items-center justify-center p-4">
                                                            <Waves className="h-8 w-8 text-blue-500 mb-2"/>
                                                            <p className="text-xl font-bold">{sensorData.waterLevel}%</p>
                                                            <p className="text-xs text-muted-foreground">Water Level</p>
                                                        </Card>
                                                        <Card className="flex flex-col items-center justify-center p-4">
                                                            <Thermometer className="h-8 w-8 text-red-500 mb-2"/>
                                                            <p className="text-xl font-bold">{sensorData.temperature}°C</p>
                                                            <p className="text-xs text-muted-foreground">Temperature</p>
                                                        </Card>
                                                        <Card className="flex flex-col items-center justify-center p-4">
                                                            <HardDrive className="h-8 w-8 text-green-600 mb-2"/>
                                                            <p className="text-xl font-bold">{sensorData.soilMoisture}%</p>
                                                            <p className="text-xs text-muted-foreground">Soil Moisture</p>
                                                        </Card>
                                                        <Card className="flex flex-col items-center justify-center p-4">
                                                            <CloudRain className="h-8 w-8 text-gray-500 mb-2"/>
                                                            <p className="text-xl font-bold">{sensorData.rain}</p>
                                                            <p className="text-xs text-muted-foreground">Rain</p>
                                                        </Card>
                                                    </div>
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
