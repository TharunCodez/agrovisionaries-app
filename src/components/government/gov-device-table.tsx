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
import { cn } from "@/lib/utils"
import { useState, Fragment, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, HardDrive, Waves, Thermometer, Rss, Battery, MapPin, Droplets } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import { useData } from "@/contexts/data-context";
import { Skeleton } from "../ui/skeleton";
import { Timestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function toDate(timestamp: Timestamp | Date | undefined): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
}

const getStatusBadge = (status: string, t: (key: string) => string) => {
    const lowerStatus = status?.toLowerCase() ?? 'offline';
    switch (lowerStatus) {
        case 'online':
            return { className: 'bg-green-600 hover:bg-green-700', label: t('online') };
        case 'warning':
            return { className: 'bg-yellow-500 hover:bg-yellow-600 text-black', label: t('gov.analytics.warning') };
        case 'critical':
             return { className: 'bg-orange-600 hover:bg-orange-700', label: t('gov.analytics.critical') };
        case 'offline':
            return { className: 'bg-red-600 hover:bg-red-700', label: t('offline') };
        default:
            return { className: 'bg-gray-500', label: t('offline') };
    }
}

export function GovDeviceTable() {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const router = useRouter();
    const { devices, farmers, isLoading } = useData();
    const { t } = useTranslation("common");

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleViewOnMap = (lat: number, lng: number) => {
        router.push(`/government/map?lat=${lat}&lng=${lng}&zoom=15`);
    };

    const devicesWithFarmer = useMemo(() => {
        if (!devices || !farmers) return [];
        return devices.map(device => {
            const farmer = farmers.find(f => f.id === device.farmerId);
            const lastUpdatedDate = toDate(device.lastUpdated);
            const timeAgo = formatDistanceToNow(lastUpdatedDate, { addSuffix: true });
            return {
                ...device,
                farmerName: farmer?.name ?? 'N/A',
                village: farmer?.village ?? 'N/A',
                district: farmer?.district ?? 'N/A',
                lastUpdated: timeAgo,
            };
        }).sort((a, b) => {
          const aNum = parseInt(a.id.split('-')[1] || '0');
          const bNum = parseInt(b.id.split('-')[1] || '0');
          if(isNaN(aNum) || isNaN(bNum)) return 0;
          return aNum - bNum;
        });
    }, [devices, farmers]);

    if(isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('gov.devices.list.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }


  return (
    <Card>
        <CardHeader>
            <CardTitle>{t('gov.devices.list.title')}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="hidden md:block">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>{t('gov.devices.table.deviceId')}</TableHead>
                    <TableHead>{t('gov.devices.table.farmer')}</TableHead>
                    <TableHead>{t('gov.devices.table.district')}</TableHead>
                    <TableHead>{t('last_updated')}</TableHead>
                    <TableHead className="text-right">{t('status')}</TableHead>
                    <TableHead className="w-[120px] text-center">{t('actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {devicesWithFarmer.map((device) => {
                        const isExpanded = expandedRow === device.id;
                        const statusInfo = getStatusBadge(device.status, t);

                        return (
                            <Fragment key={device.id}>
                                <TableRow>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(device.id)}>
                                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <HardDrive className="h-4 w-4 text-muted-foreground"/>
                                        {device.id}
                                    </TableCell>
                                    <TableCell>{device.farmerName}</TableCell>
                                    <TableCell>{device.district}</TableCell>
                                    <TableCell>{device.lastUpdated}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={cn("text-white", statusInfo.className)}>{statusInfo.label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="sm" onClick={() => handleViewOnMap(device.location.lat, device.location.lng)}>
                                            <MapPin className="mr-2 h-4 w-4"/>
                                            {t('map')}
                                        </Button>
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
                                                        <h4 className="font-bold text-lg">{t('gov.devices.table.liveReadingsTitle', { nickname: device.nickname })}</h4>
                                                        <p className="text-sm text-muted-foreground">{t('last_updated')}: {device.lastUpdated}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                            <Waves className="h-7 w-7 text-blue-500 mb-2"/>
                                                            <p className="text-lg font-bold">{device.waterLevel}%</p>
                                                            <p className="text-xs text-muted-foreground">{t('reservoir_level')}</p>
                                                        </Card>
                                                        <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                            <Waves className="h-7 w-7 text-green-600 mb-2"/>
                                                            <p className="text-lg font-bold">{device.soilMoisture}%</p>
                                                            <p className="text-xs text-muted-foreground">{t('soil_moisture')}</p>
                                                        </Card>
                                                        <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                            <Thermometer className="h-7 w-7 text-red-500 mb-2"/>
                                                            <p className="text-lg font-bold">{device.temperature}°C</p>
                                                            <p className="text-xs text-muted-foreground">{t('temperature')}</p>
                                                        </Card>
                                                         <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                            <Droplets className="h-7 w-7 text-sky-500 mb-2"/>
                                                            <p className="text-lg font-bold">{device.humidity}%</p>
                                                            <p className="text-xs text-muted-foreground">{t('humidity')}</p>
                                                         </Card>
                                                        <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                            <Rss className="h-7 w-7 text-purple-500 mb-2"/>
                                                            <p className="text-lg font-bold">{device.rssi} dBm</p>
                                                            <p className="text-xs text-muted-foreground">{t('signal_strength')}</p>
                                                        </Card>
                                                         <Card className="flex flex-col items-center justify-center p-3 text-center">
                                                            <Battery className="h-7 w-7 text-yellow-500 mb-2"/>
                                                            <p className="text-lg font-bold">{Math.round(device.rssi/-2 + 80)}%</p>
                                                            <p className="text-xs text-muted-foreground">{t('battery')}</p>
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
                     {(!devicesWithFarmer || devicesWithFarmer.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">{t('no_devices')}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {devicesWithFarmer.map(device => {
                    const statusInfo = getStatusBadge(device.status, t);
                    return (
                        <Card key={device.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <HardDrive className="h-6 w-6 text-primary"/>
                                    <div>
                                        <h3 className="font-bold">{device.id}</h3>
                                        <p className="text-sm text-muted-foreground">{device.farmerName}</p>
                                        <p className="text-xs text-muted-foreground">{device.district}</p>
                                    </div>
                                </div>
                                <Badge className={cn("text-white", statusInfo.className)}>{statusInfo.label}</Badge>
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                                    <div>
                                        <p className="font-bold text-sm">{device.temperature}°C</p>
                                        <p className="text-muted-foreground">{t('temperature')}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{device.soilMoisture}%</p>
                                        <p className="text-muted-foreground">{t('soil_moisture')}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{device.waterLevel}%</p>
                                        <p className="text-muted-foreground">{t('reservoir_level')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => handleViewOnMap(device.location.lat, device.location.lng)}>
                                    <MapPin className="mr-2 h-4 w-4"/>
                                    {t('gov.devices.table.viewOnMap')}
                                </Button>
                            </div>
                        </Card>
                    );
                })}
                 {(!devicesWithFarmer || devicesWithFarmer.length === 0) && (
                    <p className="text-muted-foreground text-center p-4">{t('no_devices')}</p>
                )}
            </div>
        </CardContent>
    </Card>
  )
}
