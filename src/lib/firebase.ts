import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "marinasuite-mvp",
  appId: "1:125869964378:web:d74000f2f1b050c2156c63",
  storageBucket: "marinasuite-mvp.firebasestorage.app",
  apiKey: "AIzaSyANglq4YsqN3PP0Sq8-U2L3fa6x0Fh_5lg",
  authDomain: "marinasuite-mvp.firebaseapp.com",
  messagingSenderId: "125869964378",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
