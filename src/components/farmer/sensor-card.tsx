import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, CloudRain, Sun, Battery, Waves } from "lucide-react";

type SensorType = 'temperature' | 'soil' | 'rain' | 'solar';

interface SensorCardProps {
    type: SensorType;
    value: string | number;
}

const sensorDetails = {
    temperature: { icon: Thermometer, label: "Temp", unit: "°C" },
    soil: { icon: Waves, label: "Moisture", unit: "%" },
    rain: { icon: CloudRain, label: "Rain", unit: "" },
    solar: { icon: Battery, label: "Solar", unit: "%" },
};

const SoilIcon = ({ moisture }: { moisture: number }) => {
    let colorClass = "text-yellow-700";
    if (moisture > 60) {
        colorClass = "text-green-600";
    } else if (moisture < 30) {
        colorClass = "text-orange-800";
    }

    return (
         <div className="relative h-16 w-16">
            <Waves className={`absolute inset-0 h-16 w-16 ${colorClass}`} />
            <div 
                className="absolute bottom-0 left-0 right-0 bg-green-600/50 transition-all duration-500"
                style={{ height: `${moisture}%` }}
            ></div>
        </div>
    )
}

const RainIcon = ({ intensity }: { intensity: string }) => {
    const intensityMap = {
        'Low': 1,
        'Medium': 3,
        'High': 5,
    }
    const count = intensityMap[intensity as keyof typeof intensityMap] || 0;

    return (
        <div className="relative h-16 w-16">
            <CloudRain className="h-16 w-16 text-blue-400" />
            {Array.from({ length: count }).map((_, i) => (
                <Droplets key={i} className="absolute h-4 w-4 text-blue-500 animate-pulse" style={{ left: `${20 + i*15}%`, top: `${50 + (i%2)*10}%`, animationDelay: `${i*100}ms`}}/>
            ))}
        </div>
    )
}

const TemperatureIcon = ({ temp }: { temp: number }) => {
    let colorClass = "text-yellow-500";
    if (temp > 30) colorClass = "text-red-500";
    if (temp < 15) colorClass = "text-blue-500";

    return (
        <div className="relative h-16 w-16">
            {temp > 25 ? <Sun className={`h-16 w-16 ${colorClass}`} /> : <Thermometer className={`h-16 w-16 ${colorClass}`} />}
        </div>
    )
}

const SolarIcon = ({ level }: { level: number }) => {
    return (
        <div className="relative h-16 w-16">
            <Battery className="h-16 w-16 text-yellow-400" />
             <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-6 bg-yellow-400 transition-all duration-500 rounded-sm"
                style={{ width: `${(level/100) * 2.5}rem` }}
            ></div>
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
            default:
                const Icon = details.icon;
                return <Icon className="h-12 w-12 text-muted-foreground" />;
        }
    }

    return (
        <Card className="flex flex-col items-center justify-center p-4 text-center">
            <CardContent className="p-0 flex flex-col items-center gap-2">
                {renderIcon()}
                <p className="text-lg font-bold">{value}{details.unit}</p>
                <p className="text-sm font-medium text-muted-foreground">{details.label}</p>
            </CardContent>
        </Card>
    );
}
