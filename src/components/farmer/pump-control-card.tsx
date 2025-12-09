'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PumpControlCard() {
  const [isPumpOn, setIsPumpOn] = useState(false);

  return (
    <Card className='overflow-hidden'>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Irrigation Pump</CardTitle>
        <Power className={cn('h-6 w-6 text-muted-foreground transition-colors', isPumpOn && 'text-green-500')}/>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 pt-4">
        <div 
            className={cn(
                "relative flex h-24 w-24 items-center justify-center rounded-full border-4 transition-all duration-500",
                isPumpOn ? 'border-green-500 bg-green-500/20 shadow-[0_0_20px_5px] shadow-green-500/30' : 'border-muted bg-muted/20'
            )}
        >
          <Switch
              id="pump-switch"
              checked={isPumpOn}
              onCheckedChange={setIsPumpOn}
              className="h-14 w-28 data-[state=checked]:bg-green-600"
              aria-label="Toggle irrigation pump"
          />
        </div>
        <p className={cn(
            'text-lg font-bold transition-colors',
            isPumpOn ? 'text-green-500' : 'text-muted-foreground'
        )}>
          {isPumpOn ? 'ON' : 'OFF'}
        </p>
      </CardContent>
    </Card>
  );
}

declare module 'react' {
  interface ComponentProps<T> {
    thumbClassName?: string;
  }
}
