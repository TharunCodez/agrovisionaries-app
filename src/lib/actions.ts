'use server';

import { smartAlertingSystem } from '@/ai/flows/smart-alerting-system';
import type { SmartAlertingSystemOutput } from '@/ai/flows/smart-alerting-system';

export async function checkForAlerts(): Promise<SmartAlertingSystemOutput> {
  try {
    const mockInput = {
      historicalData: "Past week average soil moisture: 45%. No significant rainfall. Reservoir levels have been steadily decreasing by 5% daily.",
      weatherForecast: "Next 24 hours: Clear skies, 0% chance of rain. Temperature rising to 35°C. High winds expected in the afternoon.",
      sensorReadings: "Current soil moisture: 25%. Water reservoir level: 30%.",
      thresholds: "Soil moisture critical low: 30%. Water reservoir critical low: 25%.",
    };
    const alert = await smartAlertingSystem(mockInput);
    return alert;
  } catch (error) {
    console.error('Error in checkForAlerts:', error);
    // Return a structured error to be displayed in the UI
    return {
      alertType: 'Error',
      alertMessage: 'The smart alerting system is currently unavailable. Please try again later.',
      urgencyLevel: 'low',
    };
  }
}
