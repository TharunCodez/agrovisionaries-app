import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function GovernmentNotificationsPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold">Notifications</h1>
            <Card className="flex flex-1 items-center justify-center border-dashed">
                <CardContent className="py-10 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                            <Bell className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="mb-2 text-xl">System-wide Alerts</CardTitle>
                    <p className="text-muted-foreground">
                        All regional alerts and system messages will appear here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
