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

export type Device = {
  id: string; // Firestore document ID
  farmerId: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Warning' | 'Critical';
  lastUpdated: Timestamp;
  region: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rssi: number;
  health: 'Good' | 'Excellent' | 'Warning' | 'Poor';
  waterLevel: number;
  farmerName: string;
  farmerPhone: string;
  notes?: string;
  type?: string;
};

export type Farmer = {
  id: string; // Firestore document ID
  name: string;
  region: string;
  status: 'Active' | 'Inactive';
  phone: string;
  deviceIds: string[];
};

interface DataContextType {
  devices: Device[] | null;
  farmers: Farmer[] | null;
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

  const devices = role === 'government' ? allDevices : farmerDevices;

  const isLoading = isAuthLoading || farmersLoading || allDevicesLoading || farmerDevicesLoading;

  const value = useMemo(
    () => ({ devices, farmers, isLoading }),
    [devices, farmers, isLoading]
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
