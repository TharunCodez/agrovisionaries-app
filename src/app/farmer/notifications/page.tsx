'use client';

import { useState, useEffect } from 'react';
import SmartAlert from "@/components/dashboard/smart-alert";
import { useRole } from '@/contexts/role-context';
import { listenForNotifications, type AppNotification } from '@/lib/notifications';
import NotificationCard from '@/components/notifications/NotificationCard';
import { Card, CardContent } from '@/components/ui/card';

export default function FarmerNotificationsPage() {
    const { user } = useRole();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = listenForNotifications(user.uid, setNotifications);
        return () => unsubscribe();
    }, [user]);

    return (
        <div className="flex flex-col gap-6 pb-20 md:pb-6">
            <h1 className="font-headline text-2xl font-bold md:text-3xl">Alerts & Notifications</h1>
            
            <Card>
                <CardContent className="p-0">
                    <div className="flex flex-col divide-y">
                        {notifications.length > 0 ? (
                            notifications.map(n => <NotificationCard key={n.id} notification={n} />)
                        ) : (
                             <p className="p-8 text-center text-muted-foreground">You have no notifications.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <SmartAlert />
        </div>
    );
}
