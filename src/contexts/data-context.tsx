'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { deviceData as initialDeviceData, farmerData as initialFarmerData } from '@/lib/data';

// Define types based on new requirements
export type Device = {
    id: string;
    farmerId: string;
    name: string;
    location: string;
    status: 'Online' | 'Offline' | 'Warning' | 'Critical';
    lastUpdated: Date | string;
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
  id: string;
  name: string;
  region: string;
  status: 'Active' | 'Inactive';
  phone: string;
};

interface DataContextType {
  devices: Device[];
  farmers: Farmer[];
  addDeviceAndFarmer: (device: Omit<Device, 'farmerId' | 'status' | 'lastUpdated' | 'region' | 'health' | 'humidity' | 'rssi' | 'waterLevel' | 'temperature' | 'soilMoisture'>, farmerInfo: { name: string, phone: string}) => void;
  getNextDeviceId: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(initialDeviceData);
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmerData);

  const addDeviceAndFarmer = useCallback((device: Omit<Device, 'farmerId' | 'status' | 'lastUpdated' | 'region' | 'health' | 'humidity' | 'rssi' | 'waterLevel' | 'temperature' | 'soilMoisture'>, farmerInfo: { name: string, phone: string}) => {
    setFarmers(prevFarmers => {
        let farmer = prevFarmers.find(f => f.phone === farmerInfo.phone);
        let newFarmerCreated = false;
        
        if (!farmer) {
            const newFarmerId = `F${String(prevFarmers.length + 1).padStart(3, '0')}`;
            farmer = {
                id: newFarmerId,
                name: farmerInfo.name,
                phone: farmerInfo.phone,
                region: 'Unknown', // Default region
                status: 'Active'
            };
            newFarmerCreated = true;
        }

        const newDevice: Device = {
            ...device,
            farmerId: farmer.id,
            status: 'Online',
            lastUpdated: new Date(),
            region: farmer.region,
            health: 'Good',
            humidity: 60, // Mock initial data
            rssi: -80, // Mock initial data
            temperature: 28,
            soilMoisture: 55,
            waterLevel: 75,
            farmerName: farmer.name,
            farmerPhone: farmer.phone
        };
        
        setDevices(prevDevices => [...prevDevices, newDevice]);

        if (newFarmerCreated) {
            return [...prevFarmers, farmer];
        }
        return prevFarmers;
    });
  }, []);

  const getNextDeviceId = useCallback(() => {
    const ids = devices.map(d => parseInt(d.id.split('-')[1])).filter(n => !isNaN(n));
    const lastId = ids.length > 0 ? Math.max(...ids) : 0;
    return `LIV-${String(lastId + 1).padStart(3, '0')}`;
  }, [devices]);
  
  const value = useMemo(() => ({ devices, farmers, addDeviceAndFarmer, getNextDeviceId }), [devices, farmers, addDeviceAndFarmer, getNextDeviceId]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
