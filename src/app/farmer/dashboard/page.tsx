
'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { useRole } from "@/contexts/role-context";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function FarmerDashboardPage() {
  const { user } = useRole();
  const { devices } = useData();

  const userDevices = useMemo(() => {
    if (!user?.phoneNumber || !devices) return [];
    // Filter devices based on the logged-in farmer's phone number
    return devices.filter(d => d.farmerPhone === user.phoneNumber);
  }, [devices, user]);

  return (
    <div className="flex flex-col gap-6 pb-20 md:pb-6">
       <div className="flex flex-col gap-6">
        {userDevices.length > 0 ? (
          userDevices.map(device => (
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
