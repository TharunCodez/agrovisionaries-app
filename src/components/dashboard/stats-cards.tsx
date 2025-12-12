import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Thermometer, Waves } from "lucide-react";

const stats = [
    { title: "Water Level", value: "53%", icon: Droplets, description: "-2% from yesterday" },
    { title: "Soil Moisture", value: "52%", icon: Waves, description: "+5% from yesterday" },
    { title: "Temperature", value: "32°C", icon: Thermometer, description: "Sunny" },
];

export default function StatsCards() {
    return (
        <>
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
