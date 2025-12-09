'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/data-context";
import { useMemo } from "react";

export default function FarmerList() {
  const { farmers, devices } = useData();

  const farmersWithDeviceCount = useMemo(() => {
    if (!farmers || !devices) return [];
    return farmers.map(farmer => {
      const deviceCount = devices.filter(d => d.farmerId === farmer.id).length;
      return {
        ...farmer,
        devices: deviceCount,
      }
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [farmers, devices]);

  if (!farmers) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Farmer Database</CardTitle>
                <CardDescription>Overview of farmers in the region.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Loading farmer data...</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Database</CardTitle>
        <CardDescription>Overview of farmers in the region.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Devices</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmersWithDeviceCount.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">{farmer.name}</TableCell>
                <TableCell>{farmer.phone}</TableCell>
                <TableCell>{farmer.region}</TableCell>
                <TableCell className="text-right">{farmer.devices}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={farmer.status === 'Active' ? 'default' : 'secondary'} 
                         className={farmer.status === 'Active' ? 'bg-green-600' : ''}>
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
