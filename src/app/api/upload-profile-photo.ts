'use server';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper to initialize Firebase App on the server for actions
const getFirebaseServices = () => {
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    return {
        storage: getStorage(app),
        firestore: getFirestore(app)
    };
};

export async function uploadProfilePhoto(formData: FormData): Promise<{ photoUrl?: string, error?: string }> {
  const file = formData.get('file') as File | null;
  const farmerId = formData.get('farmerId') as string | null;

  if (!file || !farmerId) {
    return { error: 'Missing file or farmer ID.' };
  }

  const { storage, firestore } = getFirebaseServices();

  const storagePath = `farmers/${farmerId}/profile.jpg`;
  const storageRef = ref(storage, storagePath);

  try {
    // 1. Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // 2. Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 3. Save it to Firestore
    const farmerRef = doc(firestore, 'farmers', farmerId);
    await updateDoc(farmerRef, {
      photoUrl: downloadURL
    });

    return { photoUrl: downloadURL };
  } catch (error: any) {
    console.error("Failed to upload profile photo:", error);
    return { error: error.message || "An unknown error occurred during upload." };
  }
}
