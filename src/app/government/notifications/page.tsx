'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Siren, HardDrive } from "lucide-react";
import { useTranslation } from "react-i18next";

const notifications = [
    {
        id: 1,
        title: "gov.notifications.items.1.title",
        description: "gov.notifications.items.1.description",
        icon: <Siren className="h-5 w-5 text-destructive" />,
        type: 'destructive',
        time: "gov.notifications.items.1.time"
    },
    {
        id: 2,
        title: "gov.notifications.items.2.title",
        description: "gov.notifications.items.2.description",
        icon: <HardDrive className="h-5 w-5 text-yellow-500" />,
        type: 'default',
        time: "gov.notifications.items.2.time"
    },
     {
        id: 3,
        title: "gov.notifications.items.3.title",
        description: "gov.notifications.items.3.description",
        icon: <Bell className="h-5 w-5 text-blue-500" />,
        type: 'default',
        time: "gov.notifications.items.3.time"
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
                                    <span>{t(notification.title)}</span>
                                    <span className="mt-1 text-xs text-muted-foreground sm:mt-0">{t(notification.time)}</span>
                                </AlertTitle>
                                <AlertDescription>
                                    {t(notification.description)}
                                </AlertDescription>
                            </div>
                        </Alert>
                     ))}
                </CardContent>
            </Card>
        </div>
    );
}
