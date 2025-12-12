'use client';

import { type AppNotification } from '@/lib/notifications';
import NotificationCard from './NotificationCard';
import { Card, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function NotificationList({ notifications }: { notifications: AppNotification[] }) {
    
    const unreadCount = notifications.filter(n => !n.read).length;
    const highUrgencyNotifications = notifications.filter(n => n.urgency === 'high');

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className='pb-2'>
        <CardTitle className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && <span className="text-sm font-medium text-primary">{unreadCount} New</span>}
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="all" className="flex flex-col">
        <div className="px-6 py-2">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
            </TabsList>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
            <TabsContent value="all" className="m-0">
            {notifications.length > 0 ? (
                notifications.map(n => <NotificationCard key={n.id} notification={n} />)
            ) : (
                <p className="p-4 text-center text-muted-foreground">No notifications yet.</p>
            )}
            </TabsContent>
            <TabsContent value="critical" className="m-0">
            {highUrgencyNotifications.length > 0 ? (
                highUrgencyNotifications.map(n => <NotificationCard key={n.id} notification={n} />)
            ) : (
                <p className="p-4 text-center text-muted-foreground">No critical notifications.</p>
            )}
            </TabsContent>
        </div>
      </Tabs>
      <CardFooter className="border-t p-2">
        <Button variant="ghost" className="w-full" asChild>
            <Link href="/farmer/notifications">View All Notifications</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
