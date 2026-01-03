import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Cloud, CloudRain, Waves, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type SensorType = 'temperature' | 'soil' | 'rain' | 'humidity';

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

const RainIcon = ({ status }: { status: string }) => {
  const isRaining = status === 'Raining';
  return isRaining 
    ? <CloudRain className="h-12 w-12 text-blue-400" />
    : <Cloud className="h-12 w-12 text-gray-400" />;
}

const HumidityIcon = ({ level }: { level: number }) => {
  return <Droplets className="h-12 w-12 text-sky-500" />;
}


export default function SensorCard({ type, value }: SensorCardProps) {
    const { t } = useTranslation();
    const sensorDetails = {
        temperature: { icon: Thermometer, label: t("temperature"), unit: "°C" },
        soil: { icon: Waves, label: t("soil_moisture"), unit: "%" },
        rain: { icon: CloudRain, label: t("rainStatus"), unit: "" },
        humidity: { icon: Droplets, label: t("humidity"), unit: "%" },
    };

    const details = sensorDetails[type];
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    const renderIcon = () => {
        switch (type) {
            case 'soil':
                return <SoilIcon moisture={numericValue} />;
            case 'temperature':
                return <TemperatureIcon temp={numericValue} />;
             case 'rain':
                return <RainIcon status={String(value)} />;
            case 'humidity':
                return <HumidityIcon level={numericValue} />;
            default:
                const Icon = details.icon;
                return <Icon className="h-12 w-12 text-muted-foreground" />;
        }
    }
    
    const displayValue = type === 'rain' 
        ? t(String(value).toLowerCase() === 'raining' ? 'raining' : 'noRain')
        : `${value}${details.unit}`;

    return (
        <Card className="flex flex-col items-center justify-center p-4 text-center aspect-square transition-all hover:bg-card hover:scale-105">
            <CardContent className="p-0 flex flex-col items-center gap-2">
                {renderIcon()}
                <p className="text-lg font-bold">{displayValue}</p>
                <p className="text-sm font-medium text-muted-foreground">{details.label}</p>
            </CardContent>
        </Card>
    );
}
