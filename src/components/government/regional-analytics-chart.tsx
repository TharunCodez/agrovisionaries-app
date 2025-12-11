'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { regionalAnalyticsData } from "@/lib/data";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function RegionalAnalyticsChart() {
  const { t } = useTranslation("common");

  const chartConfig = useMemo(() => ({
    waterUsage: {
      label: t('gov.dashboard.stats.waterUsage'),
      color: "hsl(var(--chart-1))",
    },
  }), [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('gov.dashboard.regionalWaterUsageTitle')}</CardTitle>
        <CardDescription>{t('gov.dashboard.regionalWaterUsageDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart data={regionalAnalyticsData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="waterUsage" fill="var(--color-waterUsage)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
