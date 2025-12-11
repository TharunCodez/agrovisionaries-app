'use server';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function uploadProfilePhoto(userId: string, formData: FormData): Promise<{ photoUrl?: string, error?: string }> {
  const file = formData.get('file') as File | null;

  if (!file || !userId) {
    return { error: 'Missing file or user ID.' };
  }

  const { storage, firestore } = initializeFirebase();

  const storageRef = ref(storage, `profilePhotos/${userId}/${file.name}`);

  try {
    // 1. Upload to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // 2. Get the public download URL
    const url = await getDownloadURL(storageRef);

    // 3. Save it to Firestore
    const farmerRef = doc(firestore, "farmers", userId);
    await updateDoc(farmerRef, {
      photoUrl: url
    });

    return { photoUrl: url };
  } catch (error: any) {
    console.error("Failed to upload profile photo:", error);
    return { error: error.message || "An unknown error occurred during upload." };
  }
}
