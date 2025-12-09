'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
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
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  addDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { useRole } from './role-context';

export type Device = {
  id: string; // Firestore document ID
  farmerId: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Warning' | 'Critical';
  lastUpdated: any; // Can be Date or Firestore Timestamp
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
};

interface DataContextType {
  devices: Device[];
  farmers: Farmer[];
  addDeviceAndFarmer: (
    device: Omit<
      Device,
      'id' | 'farmerId' | 'status' | 'lastUpdated' | 'region' | 'health' | 'humidity' | 'rssi' | 'waterLevel' | 'temperature' | 'soilMoisture'
    >,
    farmerInfo: { name: string; phone: string }
  ) => Promise<void>;
  getNextDeviceId: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { role } = useRole();

  // Fetch all farmers - for government user
  const allFarmersQuery = useMemoFirebase(
    () => (firestore && role === 'government' ? collection(firestore, 'farmers') : null),
    [firestore, role]
  );
  const { data: farmers = [] } = useCollection<Farmer>(allFarmersQuery);

  // Fetch all devices - for government user
  const allDevicesQuery = useMemoFirebase(
    () => (firestore && role === 'government' ? collection(firestore, 'devices') : null),
    [firestore, role]
  );
  const { data: allDevices = [] } = useCollection<Device>(allDevicesQuery);

  // Fetch devices for a specific farmer
  const farmerDevicesQuery = useMemoFirebase(
    () =>
      firestore && user && role === 'farmer'
        ? query(collection(firestore, 'devices'), where('farmerId', '==', user.uid))
        : null,
    [firestore, user, role]
  );
  const { data: farmerDevices = [] } = useCollection<Device>(farmerDevicesQuery);

  const devices = role === 'government' ? allDevices : farmerDevices;

  const getNextDeviceId = useCallback(() => {
    const allDeviceIds = (allDevices || []).map((d) =>
      parseInt(d.id.split('-')[1])
    ).filter((n) => !isNaN(n));
    const lastId = allDeviceIds.length > 0 ? Math.max(...allDeviceIds) : 0;
    return `LIV-${String(lastId + 1).padStart(3, '0')}`;
  }, [allDevices]);

  const addDeviceAndFarmer = useCallback(
    async (
      device: Omit<
        Device,
        'id' | 'farmerId' | 'status' | 'lastUpdated' | 'region' | 'health' | 'humidity' | 'rssi' | 'waterLevel' | 'temperature' | 'soilMoisture'
      >,
      farmerInfo: { name: string; phone: string }
    ) => {
      if (!firestore) return;

      const farmersRef = collection(firestore, 'farmers');
      const q = query(farmersRef, where('phone', '==', farmerInfo.phone));
      const querySnapshot = await getDocs(q);

      let farmerId: string;
      let farmerRegion = 'Unknown';

      if (querySnapshot.empty) {
        // Farmer does not exist, create a new one
        const newFarmerData = {
          name: farmerInfo.name,
          phone: farmerInfo.phone,
          region: 'Unknown',
          status: 'Active',
          createdAt: serverTimestamp(),
        };
        const farmerDocRef = await addDoc(farmersRef, newFarmerData);
        farmerId = farmerDocRef.id;
        // Also create the auth user if needed, or link if they already signed up
      } else {
        // Farmer exists
        const farmerDoc = querySnapshot.docs[0];
        farmerId = farmerDoc.id;
        farmerRegion = farmerDoc.data().region || 'Unknown';
      }

      const deviceId = getNextDeviceId();
      const deviceRef = doc(firestore, 'devices', deviceId);
      const newDeviceData = {
        ...device,
        id: deviceId,
        farmerId: farmerId,
        status: 'Online',
        lastUpdated: serverTimestamp(),
        region: farmerRegion,
        health: 'Good',
        humidity: 60,
        rssi: -80,
        temperature: 28,
        soilMoisture: 55,
        waterLevel: 75,
        createdAt: serverTimestamp(),
      };

      setDocumentNonBlocking(deviceRef, newDeviceData, { merge: true });
    },
    [firestore, getNextDeviceId]
  );

  const value = useMemo(
    () => ({ devices, farmers, addDeviceAndFarmer, getNextDeviceId }),
    [devices, farmers, addDeviceAndFarmer, getNextDeviceId]
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

// Need to import getDocs for the query
import { getDocs } from 'firebase/firestore';
