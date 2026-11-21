import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// True when the required Firebase environment variables have been filled in .env
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    !String(firebaseConfig.apiKey).includes("paste_here")
);

// Single Firebase app instance shared across the whole application
const app = initializeApp(
  isFirebaseConfigured
    ? firebaseConfig
    : {
        apiKey: "demo-placeholder-key",
        authDomain: "demo-placeholder.firebaseapp.com",
        projectId: "demo-placeholder",
        storageBucket: "demo-placeholder.appspot.com",
        messagingSenderId: "000000000000",
        appId: "1:000000000000:web:placeholder",
      }
);

export const auth = getAuth(app);
export const db = getFirestore(app);
