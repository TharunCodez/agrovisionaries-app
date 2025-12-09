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
  const { auth } = initializeFirebase();
  // Ensure reCAPTCHA is rendered
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA solved');
        },
      }
    );
  }

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
  window.confirmationResult = confirmationResult;
  return { verificationId: confirmationResult.verificationId };
}

/**
 * Verifies the OTP code and creates a user record in Firestore if it's a new user.
 * @param code The 6-digit OTP code entered by the user.
 */
export async function verifyOTP(code: string): Promise<User> {
  const { firestore } = initializeFirebase();
  if (!window.confirmationResult) {
    throw new Error('No confirmation result found. Please send OTP first.');
  }

  const result = await window.confirmationResult.confirm(code);
  const firebaseUser = result.user;

  if (!firebaseUser) {
    throw new Error('User not found after OTP verification.');
  }

  const userRef = doc(firestore, 'farmers', firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  let user: User;

  if (!userDoc.exists()) {
    // New farmer, create a profile
    const newFarmerProfile = {
      id: firebaseUser.uid,
      name: `Farmer ${firebaseUser.uid.substring(0, 5)}`, // Placeholder name
      phone: firebaseUser.phoneNumber,
      region: 'Unknown',
      language: 'en',
      deviceIds: [],
      createdAt: serverTimestamp(),
    };
    setDocumentNonBlocking(userRef, newFarmerProfile, { merge: true });
    user = {
      uid: firebaseUser.uid,
      phoneNumber: firebaseUser.phoneNumber,
      role: 'farmer',
    };
  } else {
    // Existing farmer
    const data = userDoc.data();
    user = {
      uid: firebaseUser.uid,
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
