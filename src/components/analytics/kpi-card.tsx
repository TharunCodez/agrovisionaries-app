'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend: number;
    trendDirection: 'up' | 'down';
    description: string;
}

export default function KpiCard({ title, value: finalValue, icon: Icon, trend, trendDirection, description }: KpiCardProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const numericValue = typeof finalValue === 'string' ? parseFloat(finalValue.replace('%', '')) : finalValue;
        if (isNaN(numericValue)) return;
        
        let start = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const animatedValue = Math.floor(progress * numericValue);

            setDisplayValue(animatedValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(numericValue);
            }
        };

        requestAnimationFrame(animate);
    }, [finalValue]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {typeof finalValue === 'string' && finalValue.includes('%') ? `${displayValue}%` : displayValue}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <span className={cn("flex items-center gap-1", trendDirection === 'up' ? 'text-green-600' : 'text-red-600')}>
                        {trendDirection === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(trend)}{typeof finalValue === 'string' && finalValue.includes('%') ? '%' : ''}
                    </span>
                    <span className="ml-1">{description}</span>
                </div>
            </CardContent>
        </Card>
    )
}