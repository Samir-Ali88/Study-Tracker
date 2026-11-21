import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

/**
 * Turns Firebase Auth error codes into plain, student-friendly messages.
 */
export function getAuthErrorMessage(error) {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please check and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/invalid-api-key":
    case "auth/configuration-not-found":
      return "Firebase is not configured yet. Copy .env.example to .env and paste your Firebase keys, then restart npm run dev.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const fbUser = credential.user;
    setUser({
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
    });
    return fbUser;
  }

  async function register(name, email, password) {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const credential = await createUserWithEmailAndPassword(
      auth,
      trimmedEmail,
      password
    );
    const fbUser = credential.user;

    // Save displayName on the Firebase Auth profile
    await updateProfile(fbUser, { displayName: trimmedName });

    // Create the Firestore user document: users/{uid}
    await setDoc(doc(db, "users", fbUser.uid), {
      displayName: trimmedName,
      email: fbUser.email,
      createdAt: serverTimestamp(),
    });

    // Update React state immediately so the navbar shows the new student's name
    setUser({
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: trimmedName,
    });

    return fbUser;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
