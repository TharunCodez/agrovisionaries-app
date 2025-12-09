'use server';

import { smartAlertingSystem } from '@/ai/flows/smart-alerting-system';
import type { SmartAlertingSystemOutput } from '@/ai/flows/smart-alerting-system';
import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';
import type { Farmer, Device } from '@/contexts/data-context';


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const adminDb = getFirestore();


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

type RegisterFarmerPayload = Omit<Farmer, 'id' | 'createdAt' | 'devices'>;


export async function registerFarmerAction(farmerData: RegisterFarmerPayload): Promise<{ id: string }> {
    const farmerWithDefaults = {
        ...farmerData,
        devices: [],
        createdAt: FieldValue.serverTimestamp(),
    };
    
    // Check if farmer with phone already exists
    const farmerQuery = await adminDb.collection('farmers').where('phone', '==', farmerData.phone).get();
    if (!farmerQuery.empty) {
        throw new Error(`Farmer with phone number ${farmerData.phone} already exists.`);
    }

    const docRef = await adminDb.collection('farmers').add(farmerWithDefaults);
    await docRef.update({ id: docRef.id });
    
    return { id: docRef.id };
}


export async function addDeviceAction(deviceData: Omit<Device, 'id' | 'createdAt' | 'status' | 'lastUpdated' | 'temperature' | 'humidity' | 'soilMoisture' | 'rssi' | 'health' | 'waterLevel'> & { deviceId: string; }) {
    const { deviceId, farmerId, ...restOfDeviceData } = deviceData;

    const deviceRef = adminDb.collection('devices').doc(deviceId);
    const farmerRef = adminDb.collection('farmers').doc(farmerId);

    const batch = adminDb.batch();

    // 1. Set the device data
    batch.set(deviceRef, {
      ...restOfDeviceData,
      id: deviceId, // Ensure the ID is part of the document data
      farmerId: farmerId,
      createdAt: FieldValue.serverTimestamp(),
      // Add mock sensor data on creation
      status: 'Online',
      lastUpdated: FieldValue.serverTimestamp(),
      temperature: 28 + Math.floor(Math.random() * 5),
      humidity: 60 + Math.floor(Math.random() * 10),
      soilMoisture: 55 + Math.floor(Math.random() * 10),
      waterLevel: 75 + Math.floor(Math.random() * 10),
      rssi: -80 + Math.floor(Math.random() * 10),
      health: 'Good',
    });

    // 2. Add deviceId to farmer's devices array
    batch.update(farmerRef, {
        devices: FieldValue.arrayUnion(deviceId)
    });

    await batch.commit();

    return { success: true, deviceId: deviceId };
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
