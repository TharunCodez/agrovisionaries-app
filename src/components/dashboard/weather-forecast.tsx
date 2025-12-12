import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { weatherForecastData } from "@/lib/data";
import { Cloud, CloudRain, Sun, Cloudy } from "lucide-react";

const iconMap = {
    Sun,
    Cloudy,
    CloudRain,
    Cloud,
};

export default function WeatherForecast() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between space-x-2">
          {weatherForecastData.map((day) => {
            const Icon = iconMap[day.icon] || Cloud;
            return (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium">{day.day}</p>
                <Icon className="h-8 w-8 text-muted-foreground" />
                <p className="font-bold">{day.temp}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
