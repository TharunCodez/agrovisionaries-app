'use server';

import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { normalizeFirestoreData } from '@/lib/normalizeFirestoreData';


const firebaseConfig = {
  apiKey: "AIzaSyC5TJ8aLFr1YCeDR-PTish_madUiMqJBB4",
  authDomain: "studio-9156404750-b637f.firebaseapp.com",
  projectId: "studio-9156404750-b637f",
  storageBucket: "studio-9156404750-b637f.appspot.com",
  messagingSenderId: "545867839750",
  appId: "1:545867839750:web:1fa08a994b50d2f7fa4687"
};

// Helper to initialize Firebase App on the server for actions
const getDb = () => {
    const apps = getApps();
    // Avoid re-initializing the app
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
};

export async function getFarmerProfile(phone: string) {
  const db = getDb();
  if (!db) {
    console.error("Firestore not initialized on server.");
    return null;
  }

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
