import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!admin.apps.length) {
  try {
    // Initialize with application default credentials
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    // In a production app, you might want to handle this more gracefully
    throw error;
  }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };
