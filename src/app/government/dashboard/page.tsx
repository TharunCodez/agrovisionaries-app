'use client';

import FarmerList from "@/components/government/farmer-list";
import RegionalAnalyticsChart from "@/components/government/regional-analytics-chart";
import StatsCards from "@/components/government/stats-cards";
import { useTranslation } from "react-i18next";

export default function GovernmentDashboardPage() {
    const { t } = useTranslation("common");
    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.dashboard.title')}</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatsCards />
            </div>
            <div className="grid grid-cols-1 gap-6">
                <RegionalAnalyticsChart />
                <FarmerList />
            </div>
        </div>
    )
}
