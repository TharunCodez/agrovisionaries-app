'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { regionalAnalyticsData } from "@/lib/data";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const chartConfig = {
  waterUsage: {
    label: "Water Usage (L)",
    color: "hsl(var(--chart-1))",
  },
  soilMoisture: {
    label: "Soil Moisture (%)",
    color: "hsl(var(--chart-2))"
  }
};

const mockData = regionalAnalyticsData.map(d => ({
    ...d,
    soilMoisture: Math.floor(Math.random() * (70 - 40 + 1)) + 40,
}));

export function RegionalAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Agriculture Insights</CardTitle>
        <CardDescription>Water usage and soil moisture across key regions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="region" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis yAxisId="left" orientation="left" stroke={chartConfig.waterUsage.color} tickFormatter={(value) => `${Number(value) / 1000}k`} tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis yAxisId="right" orientation="right" stroke={chartConfig.soilMoisture.color} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="waterUsage" fill="var(--color-waterUsage)" radius={4} />
                    <Bar yAxisId="right" dataKey="soilMoisture" fill="var(--color-soilMoisture)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}