'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/data-context";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "react-i18next";
import '@/lib/i18n/client';

export default function FarmerList() {
  const { farmers, isLoading } = useData();
  const { t } = useTranslation("common");

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('gov.farmers.list.title')}</CardTitle>
                <CardDescription>{t('gov.farmers.list.description')}</CardDescription>
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
        <CardTitle>{t('gov.farmers.list.title')}</CardTitle>
        <CardDescription>{t('gov.farmers.list.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('gov.farmers.table.name')}</TableHead>
              <TableHead>{t('gov.farmers.table.phone')}</TableHead>
              <TableHead>{t('gov.farmers.table.village')}</TableHead>
              <TableHead>{t('gov.farmers.table.district')}</TableHead>
              <TableHead className="text-right">{t('devices')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmers && farmers.map((farmer) => (
              <TableRow key={farmer.id}>
                <TableCell className="font-medium">{farmer.name || 'N/A'}</TableCell>
                <TableCell>{farmer.phone}</TableCell>
                <TableCell>{farmer.village || 'N/A'}</TableCell>
                <TableCell>{farmer.district || 'N/A'}</TableCell>
                <TableCell className="text-right">{farmer.devices?.length || 0}</TableCell>
              </TableRow>
            ))}
             {(!farmers || farmers.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">{t('gov.farmers.noFarmersFound')}</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
