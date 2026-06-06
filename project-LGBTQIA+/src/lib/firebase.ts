import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Portal LGBTQIA+
// Para produção, use variáveis de ambiente VITE_FIREBASE_*
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC13mMUye0ONLucJ9A3dpj8O6-bHh5igNs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portal-lgbtqia.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portal-lgbtqia",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portal-lgbtqia.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "981740255203",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:981740255203:web:6617f3e01d408606f612d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;