import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

export default function DevicesPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold">My Devices</h1>
            <Card className="flex flex-1 items-center justify-center border-dashed">
                <CardContent className="py-10 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                            <HardDrive className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="mb-2 text-xl">Device Management</CardTitle>
                    <p className="text-muted-foreground">
                        This is where you will register, view, and manage your LoRaWAN devices.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
