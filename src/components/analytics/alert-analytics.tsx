'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useTranslation } from "react-i18next";

const mockAlertsData = [
  { date: "Mon", rain: 2, water: 5, soil: 8, pump: 1 },
  { date: "Tue", rain: 3, water: 4, soil: 6, pump: 2 },
  { date: "Wed", rain: 1, water: 7, soil: 9, pump: 0 },
  { date: "Thu", rain: 4, water: 3, soil: 5, pump: 3 },
  { date: "Fri", rain: 2, water: 6, soil: 7, pump: 1 },
  { date: "Sat", rain: 5, water: 2, soil: 4, pump: 2 },
  { date: "Sun", rain: 1, water: 8, soil: 10, pump: 1 },
];


export function AlertAnalytics() {
    const { t } = useTranslation("common");

    const chartConfig = useMemo(() => ({
        rain: { label: t('gov.analytics.charts.rain'), color: "hsl(var(--chart-1))" },
        water: { label: t('gov.analytics.charts.water'), color: "hsl(var(--chart-2))" },
        soil: { label: t('gov.analytics.charts.soil'), color: "hsl(var(--chart-3))" },
        pump: { label: t('gov.analytics.charts.pump'), color: "hsl(var(--chart-4))" },
    }), [t]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('gov.analytics.alertPatternsTitle')}</CardTitle>
                <CardDescription>{t('gov.analytics.alertPatternsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <LineChart data={mockAlertsData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Legend />
                        <Line dataKey="rain" type="monotone" stroke="var(--color-rain)" strokeWidth={2} dot={false} />
                        <Line dataKey="water" type="monotone" stroke="var(--color-water)" strokeWidth={2} dot={false} />
                        <Line dataKey="soil" type="monotone" stroke="var(--color-soil)" strokeWidth={2} dot={false} />
                        <Line dataKey="pump" type="monotone" stroke="var(--color-pump)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
