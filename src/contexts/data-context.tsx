'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import {
  useCollection,
  useFirebase,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { useRole } from './role-context';

export type Plot = {
  surveyNumber: string;
  areaAcres: number;
  landType: 'Irrigated' | 'Unirrigated';
  soilType: string;
}

export type Farmer = {
  id: string; // Firestore document ID
  name: string;
  phone: string;
  aadhaar: string;
  address: string;
  village: string;
  district: string;
  plots: Plot[];
  devices: string[]; // array of device IDs
  createdAt: Timestamp;
};

export type Device = {
  id: string; // Firestore document ID which is the deviceId
  nickname: string;
  farmerId: string;
  location: { lat: number; lng: number; };
  jalkundMaxQuantity: number;
  surveyNumber: string;
  areaAcres: number;
  landType: 'Irrigated' | 'Unirrigated';
  soilType: string;
  createdAt: Timestamp;

  // Mock sensor data for now
  status: 'Online' | 'Offline' | 'Warning' | 'Critical';
  lastUpdated: Timestamp;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rssi: number;
  health: 'Good' | 'Excellent' | 'Warning' | 'Poor';
  waterLevel: number;
  farmerName?: string; // Denormalized for convenience
  farmerPhone?: string; // Denormalized for convenience
};

export type SensorData = {
    id: string; // {deviceId}-{timestamp}
    deviceId: string;
    timestamp: Timestamp;
    waterLevel: number;
    temperature: number;
    moisture: number;
    rain: number;
    pumpState: 'ON' | 'OFF';
}

interface DataContextType {
  devices: Device[] | null;
  farmers: Farmer[] | null;
  sensorData: SensorData[] | null;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { firestore } = useFirebase();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { role } = useRole();

  // Fetch all farmers - for government user
  const allFarmersQuery = useMemoFirebase(
    () => (firestore && role === 'government' ? collection(firestore, 'farmers') : null),
    [firestore, role]
  );
  const { data: farmers, isLoading: farmersLoading } = useCollection<Farmer>(allFarmersQuery);

  // Fetch all devices - for government user
  const allDevicesQuery = useMemoFirebase(
    () => (firestore && role === 'government' ? collection(firestore, 'devices') : null),
    [firestore, role]
  );
  const { data: allDevices, isLoading: allDevicesLoading } = useCollection<Device>(allDevicesQuery);

  // Fetch devices for a specific farmer
  const farmerDevicesQuery = useMemoFirebase(
    () =>
      firestore && user && role === 'farmer'
        ? query(collection(firestore, 'devices'), where('farmerId', '==', user.uid))
        : null,
    [firestore, user, role]
  );
  const { data: farmerDevices, isLoading: farmerDevicesLoading } = useCollection<Device>(farmerDevicesQuery);
  
  // For now, sensorData is mock. In a real app, you might fetch this per-device or as a stream.
  const sensorData: SensorData[] | null = useMemo(() => {
    const devicesToUse = role === 'government' ? allDevices : farmerDevices;
    if (!devicesToUse) return null;

    return devicesToUse.map(device => ({
        id: `${device.id}-${Date.now()}`,
        deviceId: device.id,
        timestamp: Timestamp.now(),
        waterLevel: device.waterLevel,
        temperature: device.temperature,
        moisture: device.soilMoisture,
        rain: Math.random() > 0.8 ? 5 : 0, // Mock rain
        pumpState: Math.random() > 0.5 ? 'ON' : 'OFF',
    }));

  }, [allDevices, farmerDevices, role]);


  const devices = role === 'government' ? allDevices : farmerDevices;

  const isLoading = isAuthLoading || farmersLoading || allDevicesLoading || farmerDevicesLoading;

  const value = useMemo(
    () => ({ devices, farmers, sensorData, isLoading }),
    [devices, farmers, sensorData, isLoading]
  );

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
