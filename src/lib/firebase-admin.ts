'use server';

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app: admin.app.App;

if (admin.apps.length === 0) {
  app = admin.initializeApp();
} else {
  app = admin.app();
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
