'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function FarmerAnalytics() {
  const { farmers, devices } = useData();
  const { t } = useTranslation("common");

  const farmerRiskData = useMemo(() => {
    if (!farmers || !devices) {
      return [];
    }

    return farmers.slice(0, 5).map(farmer => {
        const deviceCount = devices.filter(d => d.farmerId === farmer.id).length;
        const alertsCount = Math.floor(Math.random() * 15); // Mock data
        const status = alertsCount > 10 ? t('gov.analytics.risk.high') : alertsCount > 5 ? t('gov.analytics.risk.medium') : t('gov.analytics.risk.low');
        return {
            ...farmer,
            devices: deviceCount,
            alerts: alertsCount,
            status: status
        }
    }).sort((a,b) => b.alerts - a.alerts);
  }, [farmers, devices, t]);

  const getBadgeClass = (status: string) => {
    if (status === t('gov.analytics.risk.high')) return 'bg-destructive';
    if (status === t('gov.analytics.risk.medium')) return 'bg-yellow-500 text-black';
    return 'bg-green-600';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('gov.analytics.atRiskFarmersTitle')}</CardTitle>
        <CardDescription>{t('gov.analytics.atRiskFarmersDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('gov.farmers.table.farmer')}</TableHead>
              <TableHead className="text-right">{t('alerts')}</TableHead>
              <TableHead className="text-right">{t('status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmerRiskData.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">{farmer.name}</TableCell>
                <TableCell className="text-right">{farmer.alerts}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={'default'} className={getBadgeClass(farmer.status)}>
                    {farmer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
