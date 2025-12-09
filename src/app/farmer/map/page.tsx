'use client';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { useRouter } from 'next/navigation';
import { ChevronLeft, Map } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function FarmerMap() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] pb-20 md:h-[calc(100vh-4rem)] md:pb-0">
             <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft />
                </Button>
                <h1 className="font-headline text-xl font-bold">Farm Map</h1>
                <div className="w-10"></div> 
            </div>
            <Card className="flex-1 flex items-center justify-center border-dashed">
                <CardContent className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                            <Map className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle className="mb-2 text-xl">Map Temporarily Unavailable</CardTitle>
                    <CardDescription>
                        The mapping feature is currently undergoing maintenance.
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
    );
}

export default function FarmerMapPage() {
    return (
        <Suspense fallback={<Skeleton className="h-[calc(100vh-8rem)] w-full" />}>
            <FarmerMap />
        </Suspense>
    )
}
