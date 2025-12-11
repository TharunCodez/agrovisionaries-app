'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = {
    Online: 'hsl(var(--chart-1))',
    Offline: 'hsl(var(--destructive))',
    Warning: 'hsl(var(--chart-4))',
    Critical: 'hsl(var(--chart-5))',
};

export function DeviceAnalytics() {
    const { devices } = useData();
    const { t } = useTranslation();

    const chartConfig = {
        devices: {
            label: t('devices'),
        },
        Online: {
            label: t('online'),
            color: COLORS.Online,
        },
        Offline: {
            label: t('offline'),
            color: COLORS.Offline,
        },
        Warning: {
            label: t('gov.analytics.warning'),
            color: COLORS.Warning,
        },
        Critical: {
            label: t('gov.analytics.critical'),
            color: COLORS.Critical,
        }
    }

    const deviceStatusData = useMemo(() => {
        if (!devices) {
            return [];
        }
        const statusCounts = devices.reduce((acc, device) => {
            acc[device.status] = (acc[device.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(statusCounts).map(([name, value]) => ({ name, value, fill: COLORS[name as keyof typeof COLORS] }));
    }, [devices]);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{t('gov.analytics.devicePerformanceTitle')}</CardTitle>
                <CardDescription>{t('gov.analytics.devicePerformanceDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
                 <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={deviceStatusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {deviceStatusData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
