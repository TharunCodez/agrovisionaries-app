import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, CloudRain, Sun, Battery, Waves, Wind, Rss } from "lucide-react";
import { cn } from "@/lib/utils";

type SensorType = 'temperature' | 'soil' | 'rain' | 'battery' | 'wind' | 'lora';

interface SensorCardProps {
    type: SensorType;
    value: string | number;
}

const sensorDetails = {
    temperature: { icon: Thermometer, label: "Temp", unit: "°C" },
    soil: { icon: Waves, label: "Moisture", unit: "%" },
    rain: { icon: CloudRain, label: "Rain", unit: "" },
    battery: { icon: Battery, label: "Battery", unit: "%" },
    wind: { icon: Wind, label: "Wind", unit: "km/h" },
    lora: { icon: Rss, label: "Signal", unit: "dBm" }
};

const SoilIcon = ({ moisture }: { moisture: number }) => {
    let colorClass = "text-yellow-700"; // Dry
    if (moisture > 60) colorClass = "text-blue-500"; // Wet
    else if (moisture >= 30) colorClass = "text-green-600"; // Moist

    return (
        <div className="relative h-16 w-16">
            <Waves className={cn("h-16 w-16 transition-colors duration-500", colorClass)} />
            <div 
                className="absolute bottom-0 left-0 right-0 bg-current opacity-20 transition-all duration-500"
                style={{ height: `${moisture}%` }}
            ></div>
        </div>
    )
}

const TemperatureIcon = ({ temp }: { temp: number }) => {
    let colorClass = "text-yellow-500";
    if (temp > 30) colorClass = "text-red-500 animate-pulse";
    if (temp < 15) colorClass = "text-blue-300";

    return (
        <div className="relative h-16 w-16">
            {temp > 25 ? <Sun className={cn("h-16 w-16 transition-colors", colorClass)} /> : <Thermometer className={cn("h-16 w-16", colorClass)} />}
        </div>
    )
}

const BatteryIcon = ({ level }: { level: number }) => {
    return (
        <div className="relative h-16 w-16">
            <Battery className="h-16 w-16 text-muted-foreground -rotate-90" />
             <div 
                className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.1rem] h-[2.1rem] transition-all duration-500 rounded-sm origin-bottom",
                     level > 50 ? 'bg-green-500' : level > 20 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ height: `${(level/100) * 2.1}rem` }}
            ></div>
        </div>
    )
}

const LoraIcon = ({ rssi }: { rssi: number }) => {
  const quality = rssi > -90 ? 'Good' : rssi > -110 ? 'Fair' : 'Poor';
  const colorClass = quality === 'Good' ? 'text-green-500' : quality === 'Fair' ? 'text-yellow-500' : 'text-red-500';
  return <Rss className={cn('h-16 w-16', colorClass)} />;
};


export default function SensorCard({ type, value }: SensorCardProps) {
    const details = sensorDetails[type];
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    const renderIcon = () => {
        switch (type) {
            case 'soil':
                return <SoilIcon moisture={numericValue} />;
            case 'temperature':
                return <TemperatureIcon temp={numericValue} />;
             case 'battery':
                return <BatteryIcon level={numericValue} />;
             case 'lora':
                return <LoraIcon rssi={numericValue} />;
            default:
                const Icon = details.icon;
                return <Icon className="h-12 w-12 text-muted-foreground" />;
        }
    }

    return (
        <Card className="flex flex-col items-center justify-center p-4 text-center aspect-square transition-all hover:bg-card hover:scale-105">
            <CardContent className="p-0 flex flex-col items-center gap-2">
                {renderIcon()}
                <p className="text-lg font-bold">{value}{details.unit}</p>
                <p className="text-sm font-medium text-muted-foreground">{details.label}</p>
            </CardContent>
        </Card>
    );
}
