'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  useCollection,
  useFirebase,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  query,
  where,
  Timestamp,
  doc,
} from 'firebase/firestore';
import { useRole } from './role-context';
import { getFarmerProfile } from '@/app/api/farmer-data';

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
  photoUrl: string | null;
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

  // Mock sensor data
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
  setFarmers: (farmers: Farmer[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { firestore } = useFirebase();
  const { user, isLoading: isAuthLoading, role } = useRole();
  
  const [farmers, setFarmers] = useState<Farmer[] | null>(() => {
    try {
      const item = window.localStorage.getItem('farmers');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    try {
      if (farmers) {
        window.localStorage.setItem('farmers', JSON.stringify(farmers));
      } else {
        window.localStorage.removeItem('farmers');
      }
    } catch (error) {
      console.error("Could not persist farmers to localStorage", error);
    }
  }, [farmers]);

  useEffect(() => {
    // If user is a farmer and we don't have their data, fetch it.
    if (role === 'farmer' && user?.phoneNumber && !farmers && !isFetching) {
      setIsFetching(true);
      getFarmerProfile(user.phoneNumber)
        .then(profile => {
          if (profile) {
            setFarmers([profile as Farmer]);
          }
        })
        .finally(() => setIsFetching(false));
    }
  }, [user, role, farmers, isFetching]);

  // Fetch all farmers - for government user
  const allFarmersQuery = useMemoFirebase(
    () => (firestore && role === 'government' ? collection(firestore, 'farmers') : null),
    [firestore, role]
  );
  const { data: allFarmersData, isLoading: farmersLoading } = useCollection<Farmer>(allFarmersQuery);

  // Sync government data
  useEffect(() => {
      if (role === 'government' && allFarmersData) {
          setFarmers(allFarmersData);
      }
  }, [role, allFarmersData]);


  // Fetch all devices
  const allDevicesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'devices') : null),
    [firestore]
  );
  const { data: allDevices, isLoading: allDevicesLoading } = useCollection<Device>(allDevicesQuery);
  
  // Memoize farmer's devices from the allDevices list
  const farmerDevices = useMemo(() => {
     if (role === 'farmer' && user && allDevices) {
        return allDevices.filter(d => d.farmerId === user.uid);
     }
     return null;
  }, [role, user, allDevices]);
  
  // For now, sensorData is mock.
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

  const isLoading = isAuthLoading || farmersLoading || allDevicesLoading || isFetching;

  const value = useMemo(
    () => ({ devices, farmers, sensorData, isLoading, setFarmers: (f: Farmer[]) => setFarmers(f) }),
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
