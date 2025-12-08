import SmartAlert from "@/components/dashboard/smart-alert";
import PumpControlCard from "@/components/farmer/pump-control-card";
import SensorCard from "@/components/farmer/sensor-card";
import WaterTank from "@/components/farmer/water-tank";

export default function FarmerDashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <WaterTank level={53} />
        <PumpControlCard />
      </div>
       <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <SensorCard type="temperature" value="32°C" />
        <SensorCard type="soil" value="52%" />
        <SensorCard type="rain" value="Low" />
        <SensorCard type="solar" value="88%" />
      </div>
      <div className="grid grid-cols-1">
          <SmartAlert />
      </div>
    </div>
  );
}
