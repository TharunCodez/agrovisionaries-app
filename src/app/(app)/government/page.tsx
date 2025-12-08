import FarmerList from "@/components/government/farmer-list";
import RegionalAnalyticsChart from "@/components/government/regional-analytics-chart";
import StatsCards from "@/components/government/stats-cards";

export default function GovernmentPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-3xl font-bold">Regional Agriculture Overview</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatsCards />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RegionalAnalyticsChart />
                <FarmerList />
            </div>
        </div>
    )
}
