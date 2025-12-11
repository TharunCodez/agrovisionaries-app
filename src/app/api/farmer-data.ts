'use server';

import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { db } from '@/firebase';
import { normalizeFirestoreData } from '@/lib/normalizeFirestoreData';


// Helper to initialize Firebase App on the server for actions
const getDb = () => {
    return db;
};

export async function getFarmerProfile(phone: string) {
  const db = getDb();

  if (!phone) return null;

  const farmerQuery = query(
    collection(db, 'farmers'),
    where('phone', '==', phone)
  );

  const snapshot = await getDocs(farmerQuery);

  if (snapshot.empty) return null;

  const farmerDoc = snapshot.docs[0];
  const farmerData = normalizeFirestoreData({id: farmerDoc.id, ...farmerDoc.data()});


  // Load device details
  const devices = [];
  if (farmerData.devices && Array.isArray(farmerData.devices)) {
    for (const deviceId of farmerData.devices) {
      const dRef = doc(db, 'devices', deviceId);
      const dSnap = await getDoc(dRef);
      if (dSnap.exists()) {
        devices.push(normalizeFirestoreData(dSnap.data()));
      }
    }
  }

  return {
    ...farmerData,
    devices,
  };
}
