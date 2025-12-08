import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function MapPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold">Farm Map View</h1>
            <Card className="flex flex-1 items-center justify-center border-dashed">
                <CardContent className="py-10 text-center">
                     <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                            <Map className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="mb-2 text-xl">Interactive Map</CardTitle>
                    <p className="text-muted-foreground">
                        A map view of your devices and farm plots will be available here soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
