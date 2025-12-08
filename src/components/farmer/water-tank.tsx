import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";

interface WaterTankProps {
  level: number; // Percentage full
}

export default function WaterTank({ level }: WaterTankProps) {
  const waterHeight = Math.max(0, Math.min(100, level));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reservoir Level</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-4">
        <div className="relative h-48 w-32 rounded-lg border-4 border-primary bg-muted/20">
          <div
            className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-700 ease-in-out"
            style={{ height: `${waterHeight}%` }}
          >
            <Waves className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 text-blue-300" />
          </div>
           <div
            className="absolute -right-12 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary"
          >
            {level}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
