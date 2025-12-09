
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app;

if (!admin.apps.length) {
  try {
    app = admin.initializeApp();
  } catch (e) {
    console.error("Firebase Admin SDK initialization failed.", e);
    // In a real app, you might want to handle this more gracefully.
    // For now, we'll let it throw so it's obvious during development.
    throw e;
  }
} else {
  app = admin.app();
}

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
