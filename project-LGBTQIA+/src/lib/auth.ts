import { useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name
  await updateProfile(result.user, { displayName });

  // Create user profile in Firestore
  await createUserProfile(result.user, {
    displayName,
    email,
  });

  return result;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  // Check if user profile exists, if not create it
  const userDoc = await getDoc(doc(db, 'users', result.user.uid));
  if (!userDoc.exists()) {
    await createUserProfile(result.user, {
      displayName: result.user.displayName || 'Usuário',
      email: result.user.email || '',
    });
  }

  return result;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

async function createUserProfile(
  user: User,
  additionalData: { displayName: string; email: string }
) {
  const userRef = doc(db, 'users', user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    email: additionalData.email,
    displayName: additionalData.displayName,
    photoURL: user.photoURL || null,
    createdAt: new Date().toISOString(),
    role: 'user',
  }, { merge: true });
}

export async function getUserProfile(uid: string) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
}