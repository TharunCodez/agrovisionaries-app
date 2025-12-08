import PumpControlCard from "@/components/farmer/pump-control-card";
import WaterTank from "@/components/farmer/water-tank";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Share2, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";


export default function FarmerDeviceDetailPage({ params }: { params: { id: string } }) {
    const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/farmer/devices">
                        <ChevronLeft />
                    </Link>
                </Button>
                <h1 className="font-headline text-xl font-bold">Sensor LIV-001</h1>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                        <Share2 />
                    </Button>
                     <Button variant="ghost" size="icon">
                        <Settings />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Device Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="bg-green-600">Online</Badge>
                    </div>
                     <div className="flex items-center justify-between mt-2">
                        <span className="text-muted-foreground">Last updated</span>
                        <span>2 minutes ago</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
                <WaterTank level={53} />
                <PumpControlCard />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                    {mapImage && (
                         <div className="relative h-64 w-full overflow-hidden rounded-md">
                            <Image
                                src={mapImage.imageUrl}
                                alt="Device location on map"
                                fill
                                className="object-cover"
                                data-ai-hint={mapImage.imageHint}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
