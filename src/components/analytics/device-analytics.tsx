'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = {
    Online: 'hsl(var(--chart-1))',
    Offline: 'hsl(var(--destructive))',
    Warning: 'hsl(var(--chart-4))',
    Critical: 'hsl(var(--chart-5))',
};

const chartConfig = {
    devices: {
        label: "Devices",
    },
    Online: {
        label: "Online",
        color: COLORS.Online,
    },
    Offline: {
        label: "Offline",
        color: COLORS.Offline,
    },
    Warning: {
        label: "Warning",
        color: COLORS.Warning,
    },
     Critical: {
        label: "Critical",
        color: COLORS.Critical,
    }
}

export function DeviceAnalytics() {
    const { devices } = useData();

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
                <CardTitle>Device Performance</CardTitle>
                <CardDescription>Live status of all registered devices.</CardDescription>
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
