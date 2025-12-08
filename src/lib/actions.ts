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

export async function getSentinelHubToken(): Promise<{ access_token?: string; error?: string }> {
    const clientId = process.env.SENTINELHUB_CLIENT_ID;
    const clientSecret = process.env.SENTINELHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Sentinel Hub credentials are not set on the server.");
        return { error: "Sentinel Hub credentials are not configured on the server." };
    }

    try {
        const tokenResponse = await fetch('https://services.sentinel-hub.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': clientId,
                'client_secret': clientSecret
            })
        });

        if (!tokenResponse.ok) {
           const errorBody = await tokenResponse.text();
           console.error("Failed to fetch Sentinel Hub token:", errorBody);
           return { error: `Failed to fetch Sentinel Hub token: ${tokenResponse.statusText}` };
        }

        const tokenData = await tokenResponse.json();
        return { access_token: tokenData.access_token };

    } catch (error: any) {
        console.error("Error getting Sentinel Hub token:", error);
        return { error: error.message || "An unknown error occurred while fetching the token." };
    }
}
