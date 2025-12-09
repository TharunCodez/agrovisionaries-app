
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';

config();

let app: admin.app.App;

if (admin.apps.length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (e) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
            // Fallback to default credentials if parsing fails
            app = admin.initializeApp();
        }
    } else {
        // Use application default credentials if service account is not provided
        app = admin.initializeApp();
    }
} else {
    app = admin.app();
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
