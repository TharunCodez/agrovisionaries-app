'use client';

import { useData } from "@/contexts/data-context";
import { useMemo } from "react";
import { Users, HardDrive, Siren, Activity } from "lucide-react";
import KpiCard from "@/components/analytics/kpi-card";
import { RegionalAnalytics } from "@/components/analytics/regional-analytics";
import { DeviceAnalytics } from "@/components/analytics/device-analytics";
import { AlertAnalytics } from "@/components/analytics/alert-analytics";
import { FarmerAnalytics } from "@/components/analytics/farmer-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function GovernmentAnalyticsPage() {
    const { devices, farmers } = useData();
    const { t } = useTranslation();

    const stats = useMemo(() => {
        if (!devices || !farmers) {
            return {
                totalFarmers: 0,
                totalDevices: 0,
                onlineDevices: 0,
                onlinePercentage: 0,
                criticalAlerts: 0,
            }
        }
        const onlineDevices = devices.filter(d => d.status === 'Online').length;
        const criticalAlerts = 2; // Mock data for now
        const totalFarmers = farmers.length;
        const totalDevices = devices.length;
        
        return {
            totalFarmers,
            totalDevices,
            onlineDevices,
            onlinePercentage: totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0,
            criticalAlerts,
        }
    }, [devices, farmers]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.analytics.title')}</h1>
                {/* Placeholder for date range picker */}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard title={t('gov.analytics.totalFarmers')} value={stats.totalFarmers} icon={Users} trend={2} trendDirection="up" description={t('gov.analytics.inSouthSikkim')} />
                <KpiCard title={t('gov.analytics.totalDevices')} value={stats.totalDevices} icon={HardDrive} trend={15} trendDirection="up" description={t('gov.analytics.vsLastMonth')} />
                <KpiCard title={t('gov.analytics.onlineDevices')} value={`${stats.onlinePercentage}%`} icon={Activity} trend={stats.onlinePercentage - 95} trendDirection={stats.onlinePercentage - 95 > 0 ? "up" : "down"} description={t('gov.analytics.uptime')} />
                <KpiCard title={t('gov.analytics.criticalAlerts')} value={stats.criticalAlerts} icon={Siren} trend={-1} trendDirection="down" description={t('gov.analytics.inLast24h')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Regional, Device, Alert Analytics */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <RegionalAnalytics />
                    <AlertAnalytics />
                </div>
                {/* Device and Farmer Analytics */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <DeviceAnalytics />
                    <FarmerAnalytics />
                </div>
            </div>
            
             <Card className="flex flex-1 items-center justify-center border-dashed">
                <CardContent className="py-10 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                            <ShieldCheck className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="mb-2 text-xl">{t('gov.analytics.riskAnalysisTitle')}</CardTitle>
                    <CardDescription className="max-w-xs text-center text-muted-foreground">
                        {t('gov.analytics.riskAnalysisDesc')}
                    </CardDescription>
                </CardContent>
            </Card>

        </div>
    );
}
