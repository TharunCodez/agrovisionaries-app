'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { deviceData as initialDeviceData, farmerData as initialFarmerData } from '@/lib/data';
import { Device } from '@/components/farmer/device-card';

// Extend the initial farmer data with a phone property for the form
const initialFarmers = initialFarmerData.map((f, i) => ({
    ...f,
    phone: `+91987654321${i}`
}));

type Farmer = typeof initialFarmers[0];

interface DataContextType {
  devices: Device[];
  farmers: Farmer[];
  addDevice: (device: Device) => void;
  getNextDeviceId: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(initialDeviceData.map(d => ({ ...d, type: 'Multi-Sensor' })));
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);

  const addDevice = useCallback((device: Device) => {
    setDevices(prevDevices => [...prevDevices, device]);
  }, []);

  const getNextDeviceId = useCallback(() => {
    const lastId = devices
        .map(d => parseInt(d.id.split('-')[1]))
        .sort((a,b) => b - a)[0] || 0;
    return `LIV-${String(lastId + 1).padStart(3, '0')}`;
  }, [devices]);

  return (
    <DataContext.Provider value={{ devices, farmers, addDevice, getNextDeviceId }}>
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
