'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Siren, HardDrive } from "lucide-react";
import { useTranslation } from "react-i18next";

const notifications = [
    {
        id: 1,
        title: "High Water Usage Alert",
        description: "Water usage in the Punjab region has increased by 15% in the last 24 hours. Investigate for potential leaks or inefficient irrigation.",
        icon: <Siren className="h-5 w-5 text-destructive" />,
        type: 'destructive',
        time: "1 hour ago"
    },
    {
        id: 2,
        title: "Device Offline: LIV-003",
        description: "Device LIV-003 in Amit Singh's farm (Uttar Pradesh) has been offline for over 6 hours. Please check the device status.",
        icon: <HardDrive className="h-5 w-5 text-yellow-500" />,
        type: 'default',
        time: "3 hours ago"
    },
     {
        id: 3,
        title: "System Maintenance Scheduled",
        description: "A system-wide update is scheduled for tonight at 2:00 AM. A brief downtime of up to 15 minutes is expected.",
        icon: <Bell className="h-5 w-5 text-blue-500" />,
        type: 'default',
        time: "1 day ago"
    }
]

export default function GovernmentNotificationsPage() {
    const { t } = useTranslation("common");
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.notifications.title')}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{t('gov.notifications.systemAlerts')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                     {notifications.map(notification => (
                         <Alert key={notification.id} variant={notification.type as "default" | "destructive"}>
                            <div className="flex-shrink-0">{notification.icon}</div>
                            <div className="flex-grow">
                                <AlertTitle className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                                    <span>{t(`gov.notifications.items.${notification.id}.title`)}</span>
                                    <span className="mt-1 text-xs text-muted-foreground sm:mt-0">{t(`gov.notifications.items.${notification.id}.time`)}</span>
                                </AlertTitle>
                                <AlertDescription>
                                    {t(`gov.notifications.items.${notification.id}.description`)}
                                </AlertDescription>
                            </div>
                        </Alert>
                     ))}
                </CardContent>
            </Card>
        </div>
    );
}
