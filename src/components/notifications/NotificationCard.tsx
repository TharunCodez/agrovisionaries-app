'use client';

import {
  Siren,
  CloudRain,
  Droplets,
  Wind,
  Power,
  PowerOff,
  HardDrive,
  CheckCircle,
} from 'lucide-react';
import { type AppNotification, markNotificationAsRead } from '@/lib/notifications';
import { useRole } from '@/contexts/role-context';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const iconMap = {
  pump_on: Power,
  pump_off: PowerOff,
  rain_alert: CloudRain,
  water_low: Droplets,
  soil_low: Wind,
  device_offline: HardDrive,
};

const urgencyColors = {
  high: 'border-destructive/50 bg-destructive/10 text-destructive',
  medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600',
  low: 'border-primary/20 bg-primary/5 text-primary',
};

export default function NotificationCard({ notification }: { notification: AppNotification }) {
  const { user } = useRole();
  const Icon = iconMap[notification.type] || Siren;
  const colorClasses = urgencyColors[notification.urgency] || urgencyColors.low;
  
  const timestamp = notification.timestamp instanceof Timestamp ? notification.timestamp.toDate() : notification.timestamp;
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  const handleMarkAsRead = () => {
    if (user && !notification.read) {
      // This would ideally update state in the parent, but for now, we'll just fire the placeholder
      markNotificationAsRead(user.uid, notification.id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 transition-colors hover:bg-muted/50',
        !notification.read && 'bg-primary/5',
        'border-l-4',
        notification.urgency === 'high' && 'border-destructive',
        notification.urgency === 'medium' && 'border-yellow-500',
        notification.urgency === 'low' && 'border-primary/50'

      )}
      onClick={handleMarkAsRead}
      role="button"
    >
      <div className={cn("mt-1 h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center", colorClasses)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
      {!notification.read && (
         <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-primary" title="Unread"></div>
      )}
    </div>
  );
}
