'use client';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import {
  initializeFirebase,
  useFirestore,
  setDocumentNonBlocking,
} from '@/firebase';

export type User = {
  uid: string;
  phoneNumber?: string | null;
  email?: string | null;
  role: 'farmer' | 'government';
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

/**
 * Sends an OTP to the given phone number using Firebase Phone Authentication.
 * @param phoneNumber The phone number to send the OTP to.
 */
export async function sendOTP(
  phoneNumber: string
): Promise<{ verificationId: string }> {
  // Mock implementation
  console.log(`[MOCK] OTP sent to ${phoneNumber}`);
  return Promise.resolve({ verificationId: 'mock-verification-id' });
}

/**
 * Verifies the OTP code and creates a user record in Firestore if it's a new user.
 * @param code The 6-digit OTP code entered by the user.
 */
export async function verifyOTP(
  verificationId: string,
  code: string
): Promise<User> {
  const { firestore } = initializeFirebase();
  if (verificationId !== 'mock-verification-id') {
    throw new Error('Invalid verification ID for mock user.');
  }

  // Mock user creation
  const mockUserId = `mock-user-${new Date().getTime()}`;
  const mockPhoneNumber = '+919876543210'; // Using a fixed number for mock

  const userRef = doc(firestore, 'farmers', mockUserId);
  const userDoc = await getDoc(userRef);

  let user: User;

  if (!userDoc.exists()) {
    // New farmer, create a profile
    const newFarmerProfile = {
      id: mockUserId,
      name: `Farmer ${mockUserId.substring(0, 5)}`, // Placeholder name
      phone: mockPhoneNumber,
      region: 'Unknown',
      language: 'en',
      deviceIds: [],
      createdAt: serverTimestamp(),
    };
    setDocumentNonBlocking(userRef, newFarmerProfile, { merge: true });
    user = {
      uid: mockUserId,
      phoneNumber: mockPhoneNumber,
      role: 'farmer',
    };
  } else {
    // Existing farmer
    const data = userDoc.data();
    user = {
      uid: mockUserId,
      phoneNumber: data.phone,
      role: 'farmer',
    };
  }

  return user;
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
    // For this app, we assume admins are pre-provisioned in Firestore.
    // You could also create a profile here if needed.
    await auth.signOut(); // Sign out user if no admin record found
    throw new Error('Access denied. No government user record found.');
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: 'government',
  };
}
