'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterTankProps {
  level: number; // Percentage full
}

export default function WaterTank({ level }: WaterTankProps) {
  const waterHeight = Math.max(0, Math.min(100, level));

  const getWaterColor = () => {
    if (level < 20) return "bg-red-500";
    if (level < 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getTextColor = () => {
    if (level < 20) return "text-red-500";
    if (level < 50) return "text-yellow-500";
    return "text-blue-500";
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Reservoir Level</CardTitle>
        <CardDescription>Live water level status</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 pt-4">
        <div className="relative h-48 w-40 rounded-t-lg border-x-4 border-t-4 border-primary bg-muted/20 overflow-hidden">
          {/* Water fill animation */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out",
              getWaterColor()
            )}
            style={{ height: `${waterHeight}%` }}
          >
            {/* Wave animation */}
            <div className="absolute -top-1 w-full h-4 overflow-hidden">
                <div className="absolute w-[200%] h-8 bg-black/10 -bottom-4 animate-[wave_4s_ease-in-out_infinite] rounded-[45%]"></div>
            </div>
          </div>
        </div>
        <div className={cn("text-4xl font-bold", getTextColor())}>
          {level}%
        </div>
      </CardContent>
    </Card>
  );
}