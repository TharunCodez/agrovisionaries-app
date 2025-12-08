import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterTankProps {
  level: number; // Percentage full
}

export default function WaterTank({ level }: WaterTankProps) {
  const waterHeight = Math.max(0, Math.min(100, level));

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Reservoir Level</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-4">
        <div className="relative h-48 w-32 rounded-t-lg border-x-4 border-t-4 border-primary bg-muted/20 overflow-hidden">
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out",
              level > 50 ? "bg-blue-500" : level > 20 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ height: `${waterHeight}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-black/10"></div>
            <Waves className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 text-white/50 animate-[wave_4s_ease-in-out_infinite]" />
            <Waves className="absolute -top-4 left-1/4 h-8 w-8 -translate-x-1/2 text-white/50 animate-[wave_4s_ease-in-out_infinite_1s]" />
             <Waves className="absolute -top-4 left-3/4 h-8 w-8 -translate-x-1/2 text-white/50 animate-[wave_4s_ease-in-out_infinite_2s]" />
          </div>
           <div
            className={cn(
                "absolute -right-16 top-1/2 -translate-y-1/2 text-3xl font-bold transition-colors",
                level > 50 ? "text-primary" : "text-destructive"
            )}
          >
            {level}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
