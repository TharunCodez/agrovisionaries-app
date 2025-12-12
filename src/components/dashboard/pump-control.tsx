'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Power } from 'lucide-react';

export default function PumpControl() {
  const [isPumpOn, setIsPumpOn] = useState(false);

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Irrigation Pump</CardTitle>
        <Power className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                Pump Status
                </p>
                <p className={`text-sm ${isPumpOn ? 'text-primary' : 'text-muted-foreground'}`}>
                {isPumpOn ? 'Running' : 'Off'}
                </p>
            </div>
            <Switch
                id="pump-switch"
                checked={isPumpOn}
                onCheckedChange={setIsPumpOn}
                aria-label="Toggle irrigation pump"
            />
        </div>
      </CardContent>
    </Card>
  );
}
