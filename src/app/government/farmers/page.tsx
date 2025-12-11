'use client';

import FarmerList from "@/components/government/farmer-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function GovernmentFarmersPage() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-2xl md:text-3xl font-bold">{t('gov.farmers.title')}</h1>
                 <Button asChild>
                    <Link href="/government/farmers/register">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        {t('gov.farmers.registerFarmerButton')}
                    </Link>
                 </Button>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <FarmerList />
            </div>
        </div>
    )
}
