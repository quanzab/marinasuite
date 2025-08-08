import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase-config';

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence is not available in this browser.');
    }
  });


// This is a mock for client-side code, as admin SDK cannot be initialized in the browser.
// In a real Cloud Functions environment, this would be initialized once.
const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    console.log("Mock: Initializing Firebase Admin SDK");
  }
  return admin;
};


export { app, auth, db, initializeFirebaseAdmin };
