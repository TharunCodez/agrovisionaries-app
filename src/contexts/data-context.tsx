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
  getDocs,
} from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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
  devices: Device[] | null;
  farmers: Farmer[] | null;
  addDeviceAndFarmer: (
    device: {
      deviceId: string;
      lat: number;
      lng: number;
      notes?: string;
    },
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
  const { data: farmers } = useCollection<Farmer>(allFarmersQuery);

  // Fetch all devices - for government user
  const allDevicesQuery = useMemoFirebase(
    () => (firestore && role === 'government' ? collection(firestore, 'devices') : null),
    [firestore, role]
  );
  const { data: allDevices } = useCollection<Device>(allDevicesQuery);

  // Fetch devices for a specific farmer
  const farmerDevicesQuery = useMemoFirebase(
    () =>
      firestore && user && role === 'farmer'
        ? query(collection(firestore, 'devices'), where('farmerId', '==', user.uid))
        : null,
    [firestore, user, role]
  );
  const { data: farmerDevices } = useCollection<Device>(farmerDevicesQuery);

  const devices = role === 'government' ? allDevices : farmerDevices;

  const getNextDeviceId = useCallback(() => {
    const allCurrentDevices = allDevices || [];
    const allDeviceIds = allCurrentDevices.map((d) =>
      parseInt(d.id.split('-')[1])
    ).filter((n) => !isNaN(n));
    const lastId = allDeviceIds.length > 0 ? Math.max(...allDeviceIds) : 0;
    return `LIV-${String(lastId + 1).padStart(3, '0')}`;
  }, [allDevices]);

  const addDeviceAndFarmer = useCallback(
    async (
      device: {
        deviceId: string;
        lat: number;
        lng: number;
        notes?: string;
      },
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
          region: 'Unknown', // You might want to get this from a form
          status: 'Active',
          createdAt: serverTimestamp(),
        };
        const farmerDocRef = await addDoc(farmersRef, newFarmerData);
        farmerId = farmerDocRef.id;
      } else {
        // Farmer exists
        const farmerDoc = querySnapshot.docs[0];
        farmerId = farmerDoc.id;
        farmerRegion = farmerDoc.data().region || 'Unknown';
      }

      const deviceId = device.deviceId;
      const deviceRef = doc(firestore, 'devices', deviceId);

      const newDeviceData: Omit<Device, 'lastUpdated' | 'id'> & { createdAt: any } = {
        farmerId: farmerId,
        name: `Device ${deviceId}`,
        location: `Lat: ${device.lat.toFixed(4)}, Lng: ${device.lng.toFixed(4)}`,
        lat: device.lat,
        lng: device.lng,
        notes: device.notes,
        status: 'Online',
        region: farmerRegion,
        health: 'Good',
        temperature: 28 + Math.floor(Math.random() * 5),
        humidity: 60 + Math.floor(Math.random() * 10),
        soilMoisture: 55 + Math.floor(Math.random() * 10),
        waterLevel: 75 + Math.floor(Math.random() * 10),
        rssi: -80 + Math.floor(Math.random() * 10),
        farmerName: farmerInfo.name,
        farmerPhone: farmerInfo.phone,
        createdAt: serverTimestamp(),
      };

      setDocumentNonBlocking(deviceRef, { ...newDeviceData, id: deviceId }, { merge: true });
    },
    [firestore]
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
