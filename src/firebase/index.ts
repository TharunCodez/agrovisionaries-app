"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyC5TJ8aLFr1YCeDR-PTish_madUiMqJBB4",
  authDomain: "studio-9156404750-b637f.firebaseapp.com",
  projectId: "studio-9156404750-b637f",
  storageBucket: "studio-9156404750-b637f.appspot.com",
  messagingSenderId: "545867839750",
  appId: "1:545867839750:web:1fa08a994b50d2f7fa4687"
};

// This is the correct way to initialize Firebase on the client side.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// IMPORTANT: DO NOT MODIFY THIS FUNCTION - It is used by the client provider
export function initializeFirebase() {
  return {
    firebaseApp: app,
    auth: auth,
    firestore: db,
    storage: storage,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';