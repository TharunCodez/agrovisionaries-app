'use server';
/**
 * @fileOverview Implements a smart alerting system that analyzes sensor data, weather forecasts, and historical data to proactively alert farmers about potential issues.
 *
 * - smartAlertingSystem - A function that analyzes data and sends alerts.
 * - SmartAlertingSystemInput - The input type for the smartAlertingSystem function.
 * - SmartAlertingSystemOutput - The return type for the smartAlertingSystem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartAlertingSystemInputSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical data, including sensor readings and past weather patterns.'),
  weatherForecast: z.string().describe('Current weather forecast information.'),
  sensorReadings: z.string().describe('Real-time sensor readings from farm devices.'),
  thresholds: z.string().describe('Threshold values for soil moisture, water levels, etc.'),
});

export type SmartAlertingSystemInput = z.infer<typeof SmartAlertingSystemInputSchema>;

const SmartAlertingSystemOutputSchema = z.object({
  alertType: z.string().describe('The type of alert (e.g., dry soil, impending rain, low water level).'),
  alertMessage: z.string().describe('A detailed message describing the alert and recommended actions.'),
  urgencyLevel: z.string().describe('The level of urgency for the alert (e.g., low, medium, high).'),
});

export type SmartAlertingSystemOutput = z.infer<typeof SmartAlertingSystemOutputSchema>;

export async function smartAlertingSystem(input: SmartAlertingSystemInput): Promise<SmartAlertingSystemOutput> {
  return smartAlertingSystemFlow(input);
}

const smartAlertingSystemPrompt = ai.definePrompt({
  name: 'smartAlertingSystemPrompt',
  input: {schema: SmartAlertingSystemInputSchema},
  output: {schema: SmartAlertingSystemOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the following data to determine if an alert should be sent to the farmer.

Historical Data: {{{historicalData}}}
Weather Forecast: {{{weatherForecast}}}
Sensor Readings: {{{sensorReadings}}}
Thresholds: {{{thresholds}}}

Based on your analysis, determine the alert type, craft a detailed alert message with recommended actions, and assign an urgency level (low, medium, high). Consider the impact of multiple factors, such as weather forecast in combination with the current sensor readings, versus historical data to provide the most useful alert possible.
Alert Type:
Alert Message:
Urgency Level:`,
});

const smartAlertingSystemFlow = ai.defineFlow(
  {
    name: 'smartAlertingSystemFlow',
    inputSchema: SmartAlertingSystemInputSchema,
    outputSchema: SmartAlertingSystemOutputSchema,
  },
  async input => {
    const {output} = await smartAlertingSystemPrompt(input);
    return output!;
  }
);
