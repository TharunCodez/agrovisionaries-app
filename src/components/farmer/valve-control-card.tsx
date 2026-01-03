'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from "react-i18next";

export default function ValveControlCard() {
  const { t } = useTranslation();
  const [isValveOn, setIsValveOn] = useState(false);

  return (
    <Card className='overflow-hidden h-full flex flex-col'>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{t('valve')}</CardTitle>
        <SlidersHorizontal className={cn('h-6 w-6 text-muted-foreground transition-colors', isValveOn && 'text-blue-500')}/>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 pt-4">
        <div 
            className={cn(
                "relative flex h-24 w-24 items-center justify-center rounded-full border-4 transition-all duration-500",
                isValveOn ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_20px_5px] shadow-blue-500/30' : 'border-muted bg-muted/20'
            )}
        >
          <Switch
              id="valve-switch"
              checked={isValveOn}
              onCheckedChange={setIsValveOn}
              className="h-14 w-28 data-[state=checked]:bg-blue-600"
              aria-label="Toggle water valve"
          />
        </div>
        <p className={cn(
            'text-lg font-bold transition-colors',
            isValveOn ? 'text-blue-500' : 'text-muted-foreground'
        )}>
          {isValveOn ? 'ON' : 'OFF'}
        </p>
      </CardContent>
    </Card>
  );
}
