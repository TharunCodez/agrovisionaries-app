import SmartAlert from "@/components/dashboard/smart-alert";
import PumpControlCard from "@/components/farmer/pump-control-card";
import SensorCard from "@/components/farmer/sensor-card";
import WaterTank from "@/components/farmer/water-tank";
import WeatherCard from "@/components/farmer/weather-card";

export default function FarmerDashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-20 md:pb-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
           <WeatherCard />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <WaterTank level={53} />
                <PumpControlCard />
            </div>
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
