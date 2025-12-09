
'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { useRole } from "@/contexts/role-context";
import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmerDashboardPage() {
  const { user } = useRole();
  const { devices, isLoading } = useData();

  if (isLoading) {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-20 md:pb-6">
       <div className="flex flex-col gap-6">
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
      </div>
      <div className="grid grid-cols-1">
          <SmartAlert />
      </div>
    </div>
  );
}
