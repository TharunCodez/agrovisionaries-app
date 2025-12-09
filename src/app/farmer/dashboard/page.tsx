
'use client';

import SmartAlert from "@/components/dashboard/smart-alert";
import DeviceDashboardCard from "@/components/farmer/device-dashboard-card";
import { deviceData } from "@/lib/data";

export default function FarmerDashboardPage() {
  // This would be replaced with a firestore query based on the logged-in farmer
  const userDevices = deviceData.filter(d => d.farmerId === 'F001');

  return (
    <div className="flex flex-col gap-6 pb-20 md:pb-6">
       <div className="flex flex-col gap-6">
        {userDevices.map(device => (
          <DeviceDashboardCard key={device.id} device={device} />
        ))}
      </div>
      <div className="grid grid-cols-1">
          <SmartAlert />
      </div>
    </div>
  );
}
