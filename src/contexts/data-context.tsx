'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  collection,
  query,
  where,
  Timestamp,
  doc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { useRole } from './role-context';
import { getFarmerProfile } from '@/app/api/farmer-data';
import { useFirebase } from '@/firebase';
import { normalizeFirestoreData } from '@/lib/normalizeFirestoreData';


export type Plot = {
  surveyNumber: string;
  areaAcres: number;
  landType: 'Irrigated' | 'Unirrigated';
  soilType: string;
};

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
  createdAt: string; // ISO Date String
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
  createdAt: string; // ISO Date String

  // Mock sensor data
  status: 'Online' | 'Offline' | 'Warning' | 'Critical';
  lastUpdated: string; // ISO Date String
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
    timestamp: string; // ISO Date String
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
  setFarmers: React.Dispatch<React.SetStateAction<Farmer[] | null>> | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { firestore, isUserLoading: isFirebaseLoading } = useFirebase();
  const { user, role } = useRole();
  
  const [farmers, setFarmers] = useState<Farmer[] | null>(null);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Clear data on logout or role change
  useEffect(() => {
    if (!isFirebaseLoading && (!user || !role)) {
      setFarmers(null);
      setDevices(null);
      setIsDataLoading(false);
    }
  }, [user, role, isFirebaseLoading]);


  // Data fetching logic
  useEffect(() => {
    // Wait for firestore and user role to be available
    if (!firestore || !user || !role) {
      if (!isFirebaseLoading) {
        setIsDataLoading(false);
      }
      return;
    }

    const fetchData = async () => {
      setIsDataLoading(true);

      try {
        if (role === 'government') {
          const farmersQuery = query(collection(firestore, 'farmers'));
          const devicesQuery = query(collection(firestore, 'devices'));
          
          const [farmerSnapshot, deviceSnapshot] = await Promise.all([
            getDocs(farmersQuery),
            getDocs(devicesQuery)
          ]);
  
          const farmersData = farmerSnapshot.docs.map(doc => normalizeFirestoreData({ id: doc.id, ...doc.data() }));
          const devicesData = deviceSnapshot.docs.map(doc => normalizeFirestoreData({ id: doc.id, ...doc.data() }));
          
          setFarmers(farmersData);
          setDevices(devicesData);
  
        } else if (role === 'farmer' && user?.phoneNumber) {
          // Fetch specific farmer profile
          const farmerProfile = await getFarmerProfile(user.phoneNumber);
          if (farmerProfile) {
            setFarmers([farmerProfile as Farmer]);
            
            // If farmer has devices, fetch them
            if (farmerProfile.devices && farmerProfile.devices.length > 0) {
              setDevices(farmerProfile.devices as Device[]);
            } else {
              setDevices([]);
            }
          } else {
             setFarmers([]);
             setDevices([]);
          }
        } else {
          // No role or phoneNumber, clear data
          setFarmers([]);
          setDevices([]);
        }
      } catch (error) {
        console.error("Error fetching data in DataProvider:", error);
        setFarmers([]);
        setDevices([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();

  }, [firestore, user, role, isFirebaseLoading]);


  // For now, sensorData is mock.
  const sensorData: SensorData[] | null = useMemo(() => {
    if (!devices) return null;

    return devices.map(device => ({
        id: `${device.id}-${Date.now()}`,
        deviceId: device.id,
        timestamp: new Date().toISOString(),
        waterLevel: device.waterLevel,
        temperature: device.temperature,
        moisture: device.soilMoisture,
        rain: Math.random() > 0.8 ? 5 : 0, // Mock rain
        pumpState: Math.random() > 0.5 ? 'ON' : 'OFF',
    }));

  }, [devices]);


  const isLoading = isFirebaseLoading || isDataLoading;

  const value = useMemo(
    () => ({ devices, farmers, sensorData, isLoading, setFarmers }),
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
