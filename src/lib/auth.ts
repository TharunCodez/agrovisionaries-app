'use client';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export type User = {
  uid: string;
  phoneNumber?: string | null;
  email?: string | null;
  role: 'farmer' | 'government';
  isAdmin?: boolean; // Custom claim for government users
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

/**
 * Sends an OTP to the given phone number using Firebase Phone Authentication.
 * @param phoneNumber The phone number to send the OTP to.
 */
export async function sendOTP(phoneNumber: string): Promise<void> {
  const { auth } = initializeFirebase();
  // Ensure reCAPTCHA is only rendered once.
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
}

/**
 * Verifies the OTP code and creates a user record in Firestore if it's a new user.
 * @param code The 6-digit OTP code entered by the user.
 */
export async function verifyOTP(code: string): Promise<User> {
  if (!window.confirmationResult) {
    throw new Error('No confirmation result found. Please send OTP first.');
  }

  const userCredential = await window.confirmationResult.confirm(code);
  const firebaseUser = userCredential.user;
  const { firestore } = initializeFirebase();

  // Here, we can't create the farmer document on client,
  // because the server action to register a farmer does that.
  // We just need to verify the user exists or not.
  // The farmer document 'id' is NOT the firebaseUser.uid.
  
  // We will check if a farmer exists with this phone number.
  const farmersRef = collection(firestore, 'farmers');
  const q = query(farmersRef, where('phone', '==', firebaseUser.phoneNumber));
  const querySnapshot = await getDocs(q);

  let user: User;

  if (querySnapshot.empty) {
    // This case should ideally not happen if farmers are pre-registered.
    // But if it does, we can consider them a valid user but without a farmer record yet.
     user = {
      uid: firebaseUser.uid, // Use firebase auth UID for session
      phoneNumber: firebaseUser.phoneNumber,
      role: 'farmer',
    };
  } else {
    // Existing farmer, get their firestore doc id.
    const farmerDoc = querySnapshot.docs[0];
    user = {
      uid: farmerDoc.id, // Use Firestore document ID as the main identifier
      phoneNumber: farmerDoc.data().phone,
      role: 'farmer',
    };
  }
  
  // For the client-side user object, we can use the firebase uid. The DataContext will use this to fetch data.
  // The role context needs a consistent UID. Let's use firebaseUser.uid throughout.
  // The farmer document will have a phone field for matching.

  const finalUser = {
      uid: firebaseUser.uid,
      phoneNumber: firebaseUser.phoneNumber,
      role: 'farmer',
  } as User

  return finalUser;
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
