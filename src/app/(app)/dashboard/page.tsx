import PumpControl from "@/components/dashboard/pump-control";
import SmartAlert from "@/components/dashboard/smart-alert";
import StatsCards from "@/components/dashboard/stats-cards";
import WaterLevelChart from "@/components/dashboard/water-level-chart";
import WeatherForecast from "@/components/dashboard/weather-forecast";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold">Welcome Back, Farmer!</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCards />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WaterLevelChart />
        </div>
        <div className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6">
                <PumpControl />
                <WeatherForecast />
            </div>
        </div>
      </div>
       <div className="grid grid-cols-1">
          <SmartAlert />
      </div>
    </div>
  );
}
