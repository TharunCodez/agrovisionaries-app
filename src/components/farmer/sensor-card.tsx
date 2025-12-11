import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, CloudRain, Sun, Battery, Waves, Wind, Rss } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type SensorType = 'temperature' | 'soil' | 'rain' | 'battery' | 'wind' | 'lora';

interface SensorCardProps {
    type: SensorType;
    value: string | number;
}

const SoilIcon = ({ moisture }: { moisture: number }) => {
    let colorClass = "text-yellow-700"; // Dry
    if (moisture > 60) colorClass = "text-blue-500"; // Wet
    else if (moisture >= 30) colorClass = "text-green-600"; // Moist

    return <Waves className={cn("h-12 w-12 text-muted-foreground", colorClass)} />;
}

const TemperatureIcon = ({ temp }: { temp: number }) => {
    let colorClass = "text-yellow-500";
    if (temp > 30) colorClass = "text-red-500";
    if (temp < 15) colorClass = "text-blue-300";

    return  <Thermometer className={cn("h-12 w-12 text-muted-foreground", colorClass)} />;
}

const BatteryIcon = ({ level }: { level: number }) => {
    let colorClass = "text-red-500";
    if (level > 50) colorClass = "text-green-500";
    else if (level > 20) colorClass = "text-yellow-500";
    
    return <Battery className={cn("h-12 w-12 text-muted-foreground", colorClass)} />
}

const LoraIcon = ({ rssi }: { rssi: number }) => {
  const quality = rssi > -90 ? 'Good' : rssi > -110 ? 'Fair' : 'Poor';
  const colorClass = quality === 'Good' ? 'text-green-500' : quality === 'Fair' ? 'text-yellow-500' : 'text-red-500';
  return <Rss className={cn('h-12 w-12', colorClass)} />;
};


export default function SensorCard({ type, value }: SensorCardProps) {
    const { t } = useTranslation();
    const sensorDetails = {
        temperature: { icon: Thermometer, label: t("temperature"), unit: "°C" },
        soil: { icon: Waves, label: t("soil_moisture"), unit: "%" },
        rain: { icon: CloudRain, label: "Rain", unit: "" },
        battery: { icon: Battery, label: t("battery"), unit: "%" },
        wind: { icon: Wind, label: "Wind", unit: "km/h" },
        lora: { icon: Rss, label: t("signal_strength"), unit: "dBm" }
    };

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