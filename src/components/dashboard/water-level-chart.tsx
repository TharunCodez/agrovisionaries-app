'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { waterLevelData } from "@/lib/data";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  level: {
    label: "Water Level",
    color: "hsl(var(--chart-1))",
  },
};

export default function WaterLevelChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservoir Water Level</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={waterLevelData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis unit="%" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <defs>
                <linearGradient id="fillLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-level)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-level)" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <Area
              dataKey="level"
              type="natural"
              fill="url(#fillLevel)"
              stroke="var(--color-level)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
