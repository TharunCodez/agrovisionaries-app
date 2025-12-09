'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/data-context";
import { Skeleton } from "../ui/skeleton";

export default function FarmerList() {
  const { farmers, isLoading } = useData();

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Farmer Database</CardTitle>
                <CardDescription>Overview of farmers in the region.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
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
            {farmers && farmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">{farmer.name || 'N/A'}</TableCell>
                <TableCell>{farmer.phone}</TableCell>
                <TableCell>{farmer.region || 'N/A'}</TableCell>
                <TableCell className="text-right">{farmer.deviceIds?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={farmer.status === 'Active' ? 'default' : 'secondary'} 
                         className={farmer.status === 'Active' ? 'bg-green-600' : ''}>
                    {farmer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
             {(!farmers || farmers.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">No farmers found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
