import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HardDrive, Siren } from "lucide-react";
import { farmerData } from "@/lib/data";

const totalFarmers = farmerData.length;
const devicesOnline = farmerData.reduce((acc, farmer) => acc + farmer.devices, 0);

const stats = [
    { title: "Total Farmers", value: totalFarmers, icon: Users, description: "+2 this month" },
    { title: "Devices Online", value: devicesOnline, icon: HardDrive, description: "95% uptime" },
    { title: "Critical Alerts", value: "2", icon: Siren, description: "Last 24 hours" },
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
