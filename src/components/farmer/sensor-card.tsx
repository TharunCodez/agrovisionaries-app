import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, CloudRain, Sun, Battery, Waves, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type SensorType = 'temperature' | 'soil' | 'rain' | 'solar' | 'wind';

interface SensorCardProps {
    type: SensorType;
    value: string | number;
}

const sensorDetails = {
    temperature: { icon: Thermometer, label: "Temp", unit: "°C" },
    soil: { icon: Waves, label: "Moisture", unit: "%" },
    rain: { icon: CloudRain, label: "Rain", unit: "" },
    solar: { icon: Battery, label: "Solar", unit: "%" },
    wind: { icon: Wind, label: "Wind", unit: "km/h" },
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

const RainIcon = ({ intensity }: { intensity: string }) => {
    const intensityMap = { 'Low': 1, 'Medium': 3, 'High': 5 };
    const count = intensityMap[intensity as keyof typeof intensityMap] || 0;

    return (
        <div className="relative h-16 w-16">
            <CloudRain className="h-16 w-16 text-blue-400" />
            {Array.from({ length: count }).map((_, i) => (
                <Droplets key={i} className="absolute h-4 w-4 animate-pulse text-blue-500" style={{ 
                    left: `${20 + (i * 15)}%`, 
                    bottom: `${10 + Math.random() * 20}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '1s'
                }}/>
            ))}
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

const SolarIcon = ({ level }: { level: number }) => {
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

const WindIcon = ({ speed }: { speed: number }) => {
    return (
         <div className="relative h-16 w-16">
            <Wind className="h-16 w-16 text-slate-400" style={{ animation: `spin ${2 / Math.max(speed, 0.1)}s linear infinite` }} />
        </div>
    )
}


export default function SensorCard({ type, value }: SensorCardProps) {
    const details = sensorDetails[type];
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    const renderIcon = () => {
        switch (type) {
            case 'soil':
                return <SoilIcon moisture={numericValue} />;
            case 'rain':
                return <RainIcon intensity={String(value)} />;
            case 'temperature':
                return <TemperatureIcon temp={numericValue} />;
             case 'solar':
                return <SolarIcon level={numericValue} />;
            case 'wind':
                return <WindIcon speed={numericValue} />;
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
