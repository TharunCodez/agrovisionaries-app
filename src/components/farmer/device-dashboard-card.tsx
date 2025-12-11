'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronRight, HardDrive, Battery, Rss } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SensorCard from '@/components/farmer/sensor-card';
import PumpControlCard from '@/components/farmer/pump-control-card';
import WaterTank from '@/components/farmer/water-tank';
import { type Device } from '@/contexts/data-context';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from "react-i18next";

const getStatusBadgeClass = (status?: string) => {
    if (!status) return 'bg-gray-500';
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

export default function DeviceDashboardCard({ device }: { device: Device }) {
  const { t } = useTranslation();
  const lastUpdated = device.lastUpdated?.toDate ? device.lastUpdated.toDate() : new Date();
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <Card className="w-full">
      <CardHeader className='flex-row items-center justify-between'>
        <div>
            <div className='flex items-center gap-3'>
                <HardDrive className='h-6 w-6 text-primary' />
                <CardTitle>{device.nickname}</CardTitle>
            </div>
            <p className='text-sm text-muted-foreground ml-9'>{t('survey_number')}: {device.surveyNumber}</p>
        </div>
         <div className='flex flex-col items-end gap-2'>
            <Badge className={cn("text-white", getStatusBadgeClass(device.status))}>{t(device.status?.toLowerCase() ?? 'offline')}</Badge>
            <p className='text-xs text-muted-foreground'>{t('last_updated')} {timeAgo}</p>
         </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WaterTank level={device.waterLevel} />
            <PumpControlCard />
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SensorCard type="temperature" value={device.temperature} />
          <SensorCard type="soil" value={device.soilMoisture} />
          <SensorCard type="lora" value={device.rssi} />
          <SensorCard
            type="battery"
            value={Math.round(device.rssi / -2 + 80)}
          />
        </div>
         <div className="mt-4 flex justify-end border-t pt-4">
            <Button asChild variant="outline">
                <Link href={`/farmer/devices/${device.id}`}>
                    {t('view_details')} <ChevronRight className='ml-2 h-4 w-4' />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
