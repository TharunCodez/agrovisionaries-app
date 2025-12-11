'use server';

import type { Device } from '@/contexts/data-context';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, serverTimestamp, doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase';

// Helper to initialize Firebase App on the server for actions
// This creates a temporary app instance and should be used sparingly.
const getDb = () => {
    const apps = getApps();
    // Avoid re-initializing the app
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};

export async function addDeviceAction(deviceData: Omit<Device, 'id' | 'createdAt' | 'status' | 'lastUpdated' | 'temperature' | 'humidity' | 'soilMoisture' | 'rssi' | 'health' | 'waterLevel'> & { deviceId: string; }) {
    const db = getDb();
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    const { deviceId, farmerId, ...restOfDeviceData } = deviceData;

    const deviceRef = doc(db, 'devices', deviceId);
    const farmerRef = doc(db, 'farmers', farmerId);

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