'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronRight, HardDrive } from 'lucide-react';
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
import { Timestamp } from 'firebase/firestore';
import ValveControlCard from './valve-control-card';

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

function toDate(timestamp: Timestamp | Date | undefined): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
}

export default function DeviceDashboardCard({ device }: { device: Device }) {
  const { t } = useTranslation();
  const lastUpdated = toDate(device.lastUpdated);
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <Card className="w-full rounded-xl shadow-sm border p-4 sm:p-6">
      <CardHeader className='flex-row items-center justify-between p-0 mb-4'>
        <div>
            <div className='flex items-center gap-3'>
                <HardDrive className='h-6 w-6 text-primary' />
                <CardTitle>{device.nickname}</CardTitle>
            </div>
            <p className='text-sm text-muted-foreground ml-9'>{t('surveyNumber')}: {device.surveyNumber}</p>
        </div>
         <div className='flex flex-col items-end gap-2'>
            <Badge className={cn("text-white", getStatusBadgeClass(device.status))}>{t(device.status?.toLowerCase() ?? 'offline')}</Badge>
            <p className='text-xs text-muted-foreground'>{t('last_updated')} {timeAgo}</p>
         </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WaterTank level={device.waterLevel} />
            <PumpControlCard />
            <ValveControlCard />
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SensorCard type="temperature" value={device.temperature} />
          <SensorCard type="soil" value={device.soilMoisture} />
          <SensorCard type="humidity" value={device.humidity} />
          <SensorCard type="rain" value={Math.random() > 0.8 ? 'Raining' : 'No Rain'} />
        </div>
         <div className="mt-6 flex justify-end border-t pt-4">
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
