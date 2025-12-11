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
  useCollection,
  useFirebase,
  useMemoFirebase,
  useUser,
} from '@/firebase';
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
  createdAt: Timestamp | Date;
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
  createdAt: Timestamp | Date;

  // Mock sensor data
  status: 'Online' | 'Offline' | 'Warning' | 'Critical';
  lastUpdated: Timestamp | Date;
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
    timestamp: Timestamp | Date;
    waterLevel: number;
    temperature: number;
    moisture: number;
    rain: number;
    pumpState: 'ON' | 'OFF';
}

// Utility to convert Firestore Timestamps to JS Dates
const transformTimestamps = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(transformTimestamps);
  }
  if (typeof data === 'object' && data !== null) {
    if (data instanceof Timestamp) {
      return data.toDate();
    }
    const newObj: { [key: string]: any } = {};
    for (const key in data) {
      newObj[key] = transformTimestamps(data[key]);
    }
    return newObj;
  }
  return data;
};


interface DataContextType {
  devices: Device[] | null;
  farmers: Farmer[] | null;
  sensorData: SensorData[] | null;
  isLoading: boolean;
  setFarmers: (farmers: Farmer[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { firestore, isUserLoading: isFirebaseLoading } = useFirebase();
  const { user, role } = useRole();
  
  const [farmers, setFarmers] = useState<Farmer[] | null>(null);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Clear data on logout
  useEffect(() => {
    if (!isFirebaseLoading && !user) {
      setFarmers(null);
      setDevices(null);
      setIsDataLoading(false);
    }
  }, [user, isFirebaseLoading]);


  // Data fetching logic
  useEffect(() => {
    if (!firestore || !user) {
      if (!isFirebaseLoading) {
        setIsDataLoading(false);
      }
      return;
    }

    const fetchData = async () => {
      setIsDataLoading(true);

      if (role === 'government') {
        const farmersQuery = query(collection(firestore, 'farmers'));
        const devicesQuery = query(collection(firestore, 'devices'));
        
        const [farmerSnapshot, deviceSnapshot] = await Promise.all([
          getDocs(farmersQuery),
          getDocs(devicesQuery)
        ]);

        const farmersData = farmerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const devicesData = deviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setFarmers(transformTimestamps(farmersData));
        setDevices(transformTimestamps(devicesData));

      } else if (role === 'farmer' && user.phoneNumber) {
        // Fetch specific farmer profile
        const farmerProfile = await getFarmerProfile(user.phoneNumber);
        if (farmerProfile) {
          const transformedFarmer = transformTimestamps(farmerProfile);
          setFarmers([transformedFarmer as Farmer]);
          
          // If farmer has devices, fetch them
          if (farmerProfile.devices && farmerProfile.devices.length > 0) {
            const devicesData = transformTimestamps(farmerProfile.devices);
            setDevices(devicesData as Device[]);
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
      setIsDataLoading(false);
    };

    fetchData();

  }, [firestore, user, role]);


  // For now, sensorData is mock.
  const sensorData: SensorData[] | null = useMemo(() => {
    if (!devices) return null;

    return devices.map(device => ({
        id: `${device.id}-${Date.now()}`,
        deviceId: device.id,
        timestamp: new Date(),
        waterLevel: device.waterLevel,
        temperature: device.temperature,
        moisture: device.soilMoisture,
        rain: Math.random() > 0.8 ? 5 : 0, // Mock rain
        pumpState: Math.random() > 0.5 ? 'ON' : 'OFF',
    }));

  }, [devices]);


  const isLoading = isFirebaseLoading || isDataLoading;

  const handleSetFarmers = useCallback((newFarmers: Farmer[]) => {
    setFarmers(newFarmers);
  }, []);

  const value = useMemo(
    () => ({ devices, farmers, sensorData, isLoading, setFarmers: handleSetFarmers }),
    [devices, farmers, sensorData, isLoading, handleSetFarmers]
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
