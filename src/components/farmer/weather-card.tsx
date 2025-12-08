'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Cloudy, Wind, Sunrise, Sunset, Eye, Gauge } from "lucide-react";
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

const iconMap: { [key: number]: React.ElementType } = {
  1000: Sun, // Clear
  1100: Sun, // Mostly Clear
  1101: Cloudy, // Partly Cloudy
  1102: Cloud, // Mostly Cloudy
  1001: Cloud, // Cloudy
  2000: Wind, // Fog
  2100: Wind, // Light Fog
  4000: CloudRain, // Drizzle
  4001: CloudRain, // Rain
  4200: CloudRain, // Light Rain
  4201: CloudRain, // Heavy Rain
  // Add more mappings as needed
};

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  visibility: number;
  sunriseTime: string;
  sunsetTime: string;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = process.env.NEXT_PUBLIC_TOMORROW_IO_API_KEY;
      if (!apiKey) {
        setError("API key not found.");
        setLoading(false);
        return;
      }

      // Using a fixed location for demonstration (New Delhi, India)
      const lat = 28.6139;
      const lon = 77.2090;
      const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        const data = await response.json();
        const values = data.data.values;
        setWeather({
          temperature: Math.round(values.temperature),
          weatherCode: values.weatherCode,
          windSpeed: values.windSpeed,
          humidity: values.humidity,
          visibility: values.visibility,
          sunriseTime: new Date(values.sunriseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sunsetTime: new Date(values.sunsetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-24" />
          <div className="grid grid-cols-3 gap-4 w-full">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader><CardTitle>Weather</CardTitle></CardHeader>
        <CardContent><p className='text-destructive'>Could not load weather data. {error}</p></CardContent>
      </Card>
    )
  }
  
  const WeatherIcon = iconMap[weather.weatherCode] || Cloud;
  const tempColor = weather.temperature > 30 ? 'text-red-500' : weather.temperature < 15 ? 'text-blue-400' : 'text-yellow-500';

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Live Weather</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center justify-between gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
            <WeatherIcon className={cn("h-20 w-20", tempColor)} />
            <p className="text-5xl font-bold">{weather.temperature}°C</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
                <Wind className="h-5 w-5 text-muted-foreground" />
                <span className='font-bold'>{weather.windSpeed} km/h</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <span className='font-bold'>{weather.humidity}%</span>
            </div>
             <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <span className='font-bold'>{weather.visibility} km</span>
            </div>
        </div>
         <div className="grid w-full grid-cols-2 gap-2 text-sm">
             <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-2">
                <Sunrise className="h-6 w-6 text-muted-foreground" />
                <span className="font-bold">{weather.sunriseTime}</span>
            </div>
             <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-2">
                <Sunset className="h-6 w-6 text-muted-foreground" />
                <span className="font-bold">{weather.sunsetTime}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
