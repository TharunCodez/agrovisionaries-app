'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HardDrive, Siren } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import '@/lib/i18n/client';

export default function StatsCards() {
    const { farmers, devices } = useData();
    const { t } = useTranslation("common");

    const totalFarmers = farmers ? farmers.length : 0;
    const onlineDevices = devices ? devices.filter(d => d.status === 'Online').length : 0;
    const totalDevices = devices ? devices.length : 0;

    const stats = useMemo(() => [
        { title: t('gov.dashboard.stats.totalFarmers'), value: totalFarmers, icon: Users, description: t('gov.dashboard.stats.totalFarmersDesc') },
        { title: t('gov.dashboard.stats.devicesOnline'), value: `${onlineDevices} / ${totalDevices}`, icon: HardDrive, description: `${totalDevices > 0 ? Math.round(onlineDevices/totalDevices * 100) : 0}% ${t('gov.dashboard.stats.uptime')}` },
        { title: t('gov.dashboard.stats.criticalAlerts'), value: "2", icon: Siren, description: t('gov.dashboard.stats.last24h') },
    ], [t, totalFarmers, onlineDevices, totalDevices]);

    return (
        <>
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
