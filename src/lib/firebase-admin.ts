import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';

config();

let app: admin.app.App;

if (admin.apps.length === 0) {
  app = admin.initializeApp();
} else {
  app = admin.app();
}

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
