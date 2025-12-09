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
  arrayUnion,
  writeBatch,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export type User = {
  uid: string;
  phoneNumber?: string | null;
  email?: string | null;
  role: 'farmer' | 'government';
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

  const userRef = doc(firestore, 'farmers', firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  let user: User;

  if (!userDoc.exists()) {
    // New farmer, create a profile
    const newFarmerProfile = {
      id: firebaseUser.uid,
      name: null, // Name will be set by gov user
      phone: firebaseUser.phoneNumber,
      deviceIds: [],
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newFarmerProfile);
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
    await auth.signOut(); // Sign out user if no admin record found
    throw new Error('This account is not authorized for government access.');
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    role: 'government',
  };
}

export async function addDeviceAndFarmerAction(
  device: {
    deviceId: string;
    lat: number;
    lng: number;
    notes?: string;
  },
  farmerInfo: { name: string; phone: string }
) {
  const { firestore } = initializeFirebase();
  const batch = writeBatch(firestore);

  const farmersRef = collection(firestore, 'farmers');
  const q = query(farmersRef, where('phone', '==', farmerInfo.phone));
  const querySnapshot = await getDocs(q);

  let farmerId: string;
  let farmerRef;
  let farmerRegion = 'Unknown'; // Default region

  if (querySnapshot.empty) {
    // Farmer does not exist, create a new one.
    // Firestore can auto-generate an ID if we use addDoc, but here we want a specific ref.
    farmerRef = doc(collection(firestore, 'farmers'));
    farmerId = farmerRef.id;
    const newFarmerData = {
      id: farmerId,
      name: farmerInfo.name,
      phone: farmerInfo.phone,
      region: farmerRegion,
      status: 'Active',
      deviceIds: [device.deviceId], // Add the first device
      createdAt: serverTimestamp(),
    };
    batch.set(farmerRef, newFarmerData);
  } else {
    // Farmer exists, update their record.
    const farmerDoc = querySnapshot.docs[0];
    farmerRef = farmerDoc.ref;
    farmerId = farmerDoc.id;
    farmerRegion = farmerDoc.data().region || 'Unknown';
    batch.update(farmerRef, {
      deviceIds: arrayUnion(device.deviceId),
    });
  }

  // Create the device document
  const deviceRef = doc(firestore, 'devices', device.deviceId);
  const newDeviceData = {
    id: device.deviceId,
    farmerId: farmerId,
    name: `Device ${device.deviceId}`,
    location: `Lat: ${device.lat.toFixed(4)}, Lng: ${device.lng.toFixed(4)}`,
    lat: device.lat,
lng: device.lng,
    notes: device.notes,
    status: 'Online',
    region: farmerRegion,
    health: 'Good',
    temperature: 28 + Math.floor(Math.random() * 5),
    humidity: 60 + Math.floor(Math.random() * 10),
    soilMoisture: 55 + Math.floor(Math.random() * 10),
    waterLevel: 75 + Math.floor(Math.random() * 10),
    rssi: -80 + Math.floor(Math.random() * 10),
    farmerName: farmerInfo.name,
    farmerPhone: farmerInfo.phone,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  };

  batch.set(deviceRef, newDeviceData);

  // Commit all writes at once
  await batch.commit();

  return { deviceId: device.deviceId, farmerId: farmerId };
}
