
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyANglq4YsqN3PP0Sq8-U2L3fa6x0Fh_5lg",
    authDomain: "marinasuite-mvp.firebaseapp.com",
    projectId: "marinasuite-mvp",
    storageBucket: "marinasuite-mvp.appspot.com",
    messagingSenderId: "125869964378",
    appId: "1:125869964378:web:d74000f2f1b050c2156c63",
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
