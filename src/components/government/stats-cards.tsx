import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HardDrive, Siren } from "lucide-react";

const stats = [
    { title: "Total Farmers", value: "358", icon: Users, description: "+22 this month" },
    { title: "Devices Online", value: "1,204", icon: HardDrive, description: "95% uptime" },
    { title: "Critical Alerts", value: "12", icon: Siren, description: "Last 24 hours" },
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
