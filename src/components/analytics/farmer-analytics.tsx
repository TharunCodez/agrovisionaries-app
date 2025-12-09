'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";

export function FarmerAnalytics() {
  const { farmers, devices } = useData();

  const farmerRiskData = useMemo(() => {
    return farmers.slice(0, 5).map(farmer => {
        const deviceCount = devices.filter(d => d.farmerPhone === farmer.phone).length;
        const alertsCount = Math.floor(Math.random() * 15); // Mock data
        const status = alertsCount > 10 ? 'High Risk' : alertsCount > 5 ? 'Medium Risk' : 'Low Risk';
        return {
            ...farmer,
            devices: deviceCount,
            alerts: alertsCount,
            status: status
        }
    }).sort((a,b) => b.alerts - a.alerts);
  }, [farmers, devices]);

  const getBadgeClass = (status: string) => {
    if (status === 'High Risk') return 'bg-destructive';
    if (status === 'Medium Risk') return 'bg-yellow-500 text-black';
    return 'bg-green-600';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top At-Risk Farmers</CardTitle>
        <CardDescription>Farmers with the highest number of critical alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farmer</TableHead>
              <TableHead className="text-right">Alerts</TableHead>
              <TableHead className="text-right">Status</TableHead>
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