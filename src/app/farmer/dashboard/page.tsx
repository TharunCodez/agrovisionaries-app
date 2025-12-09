
'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { useRole } from "@/contexts/role-context";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";

export default function FarmerDashboardPage() {
  const { user } = useRole();
  const { devices } = useData();

  const userDevices = useMemo(() => {
    if (!user?.phoneNumber) return [];
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
          <p>No devices found for your account.</p>
        )}
      </div>
      <div className="grid grid-cols-1">
          <SmartAlert />
      </div>
    </div>
  );
}
