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
import { initializeFirebase } from '@/firebase';

export type User = {
  uid: string;
  phoneNumber?: string | null;
  email?: string | null;
  role: 'farmer' | 'government';
  isAdmin?: boolean; // Custom claim for government users
};

// This function is now a server action helper, not using Firebase Auth for OTP
export async function checkFarmerExists(phoneNumber: string): Promise<{ exists: boolean; farmerId: string | null }> {
  const { firestore } = initializeFirebase();
  const farmersRef = collection(firestore, 'farmers');
  const q = query(farmersRef, where('phone', '==', phoneNumber));
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
