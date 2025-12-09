'use server';

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

let app: admin.app.App;

if (!admin.apps.length) {
  // Initialize with explicit credentials which is more robust in some serverless environments.
  app = admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
} else {
  app = admin.app();
}

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
