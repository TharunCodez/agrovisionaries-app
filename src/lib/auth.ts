'use client';
import {
  getAuth,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { initializeFirebase, db } from '@/firebase';

export type User = {
  uid: string;
  phoneNumber?: string | null;
  email?: string | null;
  role: 'farmer' | 'government';
  isAdmin?: boolean; // Custom claim for government users
};

// This function is now a client-side utility using the imported db instance
export async function checkFarmerExists(phoneNumber: string): Promise<{ exists: boolean; farmerId: string | null }> {
  if (!db) {
      throw new Error("Firestore is not initialized.");
  }
  const farmersRef = collection(db, 'farmers');
  const q = query(farmersRef, where('phone', '==', phoneNumber.trim()));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Farmer exists
    const farmerDoc = querySnapshot.docs[0];
    return { exists: true, farmerId: farmerDoc.id };
  }

  return { exists: false, farmerId: null };
}


/**
 * Signs in a government user with email and password.
 * @param email The user's email.
 * @param password The user's password.
 */
export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<User> {
  const { auth, firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error("Firestore is not initialized.");
  }
  const userCredential = await firebaseSignInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUser = userCredential.user;

  const adminRef = doc(firestore, 'admins', firebaseUser.uid);
  const adminDoc = await getDoc(adminRef);

  if (!adminDoc.exists()) {
    // To be secure, you should not give specific error messages.
    // But for this project, we can be more descriptive.
    await auth.signOut();
    throw new Error('This account is not authorized for government access.');
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: 'government',
    isAdmin: true,
  };
}