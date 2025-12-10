'use server';

import { smartAlertingSystem } from '@/ai/flows/smart-alerting-system';
import type { SmartAlertingSystemOutput } from '@/ai/flows/smart-alerting-system';
import type { Farmer, Device } from '@/contexts/data-context';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firebase App on the server for actions
// This creates a temporary app instance and should be used sparingly.
const getDb = () => {
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};


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
    const db = getDb();
    
    // Check if farmer with phone already exists
    const farmersRef = collection(db, 'farmers');
    const q = query(farmersRef, where('phone', '==', farmerData.phone));
    const farmerQuery = await getDocs(q);

    if (!farmerQuery.empty) {
        throw new Error(`Farmer with phone number ${farmerData.phone} already exists.`);
    }

    const farmerWithDefaults = {
        name: farmerData.name,
        phone: farmerData.phone,
        aadhaar: farmerData.aadhaar,
        address: farmerData.address,
        village: farmerData.village,
        district: farmerData.district,
        plots: farmerData.plots,
        devices: [],
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'farmers'), farmerWithDefaults);
    await updateDoc(docRef, { id: docRef.id });
    
    return { id: docRef.id };
}


export async function addDeviceAction(deviceData: Omit<Device, 'id' | 'createdAt' | 'status' | 'lastUpdated' | 'temperature' | 'humidity' | 'soilMoisture' | 'rssi' | 'health' | 'waterLevel'> & { deviceId: string; }) {
    const db = getDb();
    const { deviceId, farmerId, ...restOfDeviceData } = deviceData;

    const deviceRef = doc(db, 'devices', deviceId);
    const farmerRef = doc(db, 'farmers', farmerId);

    // Using client SDK means we can't use a batch write across different collections in a single server action like this easily without transactions.
    // For simplicity, we'll perform the operations sequentially.

    // 1. Set the device data
    await setDoc(deviceRef, {
      ...restOfDeviceData,
      id: deviceId,
      farmerId: farmerId,
      createdAt: serverTimestamp(),
      // Add mock sensor data on creation
      status: 'Online',
      lastUpdated: serverTimestamp(),
      temperature: 28 + Math.floor(Math.random() * 5),
      humidity: 60 + Math.floor(Math.random() * 10),
      soilMoisture: 55 + Math.floor(Math.random() * 10),
      waterLevel: 75 + Math.floor(Math.random() * 10),
      rssi: -80 + Math.floor(Math.random() * 10),
      health: 'Good',
    });

    // 2. Add deviceId to farmer's devices array
    await updateDoc(farmerRef, {
        devices: arrayUnion(deviceId)
    });

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