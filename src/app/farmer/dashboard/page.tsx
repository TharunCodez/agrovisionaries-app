
'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import ChatAssistant from "@/components/farmer/chat-assistant";

export default function FarmerDashboardPage() {
  const { devices, isLoading } = useData();

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_3fr] gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="hidden lg:block">
                <Skeleton className="h-[calc(100vh-10rem)] w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_3fr] gap-6 pb-20 md:pb-6">
       <div className="lg:col-span-2 flex flex-col gap-6">
        {devices && devices.length > 0 ? (
          devices.map(device => (
            <DeviceDashboardCard key={device.id} device={device} />
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Devices Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No devices have been registered for your account yet. Please contact your local government office to get started.</p>
               <Button asChild className="mt-4">
                  <Link href="/farmer/devices">View Devices Page</Link>
                </Button>
            </CardContent>
          </Card>
        )}
        <SmartAlert />
      </div>
      <div className="hidden lg:block lg:col-start-3">
        <ChatAssistant />
      </div>
    </div>
  );
}
