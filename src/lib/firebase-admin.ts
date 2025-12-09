'use server';
import * as admin from 'firebase-admin';

let app: admin.app.App;

if (admin.apps.length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    // For local development with emulators or auto-detection in GCP environments
    app = admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    throw new Error('Firebase Admin SDK initialization failed. Set FIREBASE_SERVICE_ACCOUNT or NEXT_PUBLIC_FIREBASE_PROJECT_ID.');
  }
} else {
  app = admin.app();
}

export const adminApp = app;
