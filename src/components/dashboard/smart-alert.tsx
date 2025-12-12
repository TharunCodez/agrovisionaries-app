'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertTriangle, CheckCircle2, Loader, Siren } from 'lucide-react';
import type { SmartAlertingSystemOutput } from '@/ai/flows/smart-alerting-system';
import { runSmartAlerting } from '@/app/api/ai-actions';

export default function SmartAlert() {
  const [alert, setAlert] = useState<SmartAlertingSystemOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckAlerts = async () => {
    setIsLoading(true);
    setAlert(null);
    try {
        const mockInput = {
            historicalData: "Past week average soil moisture: 45%. No significant rainfall. Reservoir levels have been steadily decreasing by 5% daily.",
            weatherForecast: "Next 24 hours: Clear skies, 0% chance of rain. Temperature rising to 35°C. High winds expected in the afternoon.",
            sensorReadings: "Current soil moisture: 25%. Water reservoir level: 30%.",
            thresholds: "Soil moisture critical low: 30%. Water reservoir critical low: 25%.",
        };
        const result = await runSmartAlerting(mockInput);
        setAlert(result);
    } catch (error) {
        console.error('Error in checkForAlerts:', error);
        setAlert({
            alertType: 'Error',
            alertMessage: 'The smart alerting system is currently unavailable. Please try again later.',
            urgencyLevel: 'low',
        });
    }
    setIsLoading(false);
  };

  const getUrgencyProps = (urgencyLevel: string | undefined) => {
    switch (urgencyLevel?.toLowerCase()) {
      case 'high':
        return { variant: 'destructive', icon: <Siren className="h-5 w-5" /> };
      case 'medium':
        return { variant: 'default', className: 'border-yellow-500/50 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500', icon: <AlertTriangle className="h-5 w-5" /> };
      case 'low':
        return { variant: 'default', className: 'border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500', icon: <CheckCircle2 className="h-5 w-5" /> };
      case 'error':
         return { variant: 'destructive', icon: <AlertTriangle className="h-5 w-5" /> };
      default:
        return { variant: 'default', icon: <Terminal className="h-5 w-5" /> };
    }
  };

  const { variant, className, icon } = getUrgencyProps(alert?.urgencyLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Smart Alerts</CardTitle>
        <CardDescription>
          Our AI system analyzes your farm's data to predict and highlight potential issues before they become problems.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <Button onClick={handleCheckAlerts} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            'Check for Potential Issues'
          )}
        </Button>
        {alert && (
            <Alert variant={variant} className={className}>
              {icon}
              <AlertTitle className="font-bold">{alert.alertType} (Urgency: {alert.urgencyLevel})</AlertTitle>
              <AlertDescription>
                {alert.alertMessage}
              </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
