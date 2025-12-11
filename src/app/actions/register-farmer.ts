'use server';

import type { Farmer } from '@/contexts/data-context';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firebase App on the server for actions
// This creates a temporary app instance and should be used sparingly.
const getDb = () => {
    const apps = getApps();
    // Avoid re-initializing the app
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};

type RegisterFarmerPayload = Omit<Farmer, 'id' | 'createdAt' | 'devices' | 'photoUrl'>;

export async function registerFarmerAction(farmerData: RegisterFarmerPayload): Promise<{ id: string }> {
    const db = getDb();
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    
    const farmersRef = collection(db, 'farmers');
    
    // Check if farmer with phone already exists
    const phoneQuery = query(farmersRef, where('phone', '==', farmerData.phone));
    const phoneSnapshot = await getDocs(phoneQuery);
    if (!phoneSnapshot.empty) {
        throw new Error(`A farmer with phone number ${farmerData.phone} is already registered.`);
    }
    
    // Check if farmer with Aadhaar already exists
    const aadhaarQuery = query(farmersRef, where('aadhaar', '==', farmerData.aadhaar));
    const aadhaarSnapshot = await getDocs(aadhaarQuery);
     if (!aadhaarSnapshot.empty) {
        throw new Error(`A farmer with Aadhaar number ${farmerData.aadhaar} is already registered.`);
    }

    const farmerWithDefaults = {
        name: farmerData.name,
        phone: farmerData.phone,
        aadhaar: farmerData.aadhaar,
        address: farmerData.address,
        village: farmerData.village,
        district: farmerData.district,
        plots: farmerData.plots,
        devices: [],
        photoUrl: null,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'farmers'), farmerWithDefaults);
    // Set the ID field to the document ID
    await updateDoc(docRef, { id: docRef.id });
    
    return { id: docRef.id };
}
