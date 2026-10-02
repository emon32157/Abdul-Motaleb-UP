import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDv8mITjHXooxaFUAGqf3UZmd3zj3nb3PU",
  authDomain: "abdul-motaleb-website.firebaseapp.com",
  projectId: "abdul-motaleb-website",
  storageBucket: "abdul-motaleb-website.firebasestorage.app",
  messagingSenderId: "219557394946",
  appId: "1:219557946394:web:5745b3ea361c7345f6dda3"
};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
