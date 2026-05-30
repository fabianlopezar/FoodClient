import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../../config/firebase";
import { clearAuthSession, saveAuthSession } from "../../helpers/storage";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "user" | "admin";
};

function mapUser(user: User): AuthUser {
  const role =
    user.email?.endsWith("@admin.foodclient.local") ||
    user.email === import.meta.env.VITE_ADMIN_EMAIL
      ? "admin"
      : "user";
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role,
  };
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      "Firebase no está configurado. Define las variables VITE_FIREBASE_* en .env"
    );
  }
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(credential.user, { displayName });
  const token = await credential.user.getIdToken();
  const mapped = mapUser(credential.user);
  await saveAuthSession(token, mapped);
  return mapped;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      "Firebase no está configurado. Define las variables VITE_FIREBASE_* en .env"
    );
  }
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdToken();
  const mapped = mapUser(credential.user);
  await saveAuthSession(token, mapped);
  return mapped;
}

export async function logoutUser(): Promise<void> {
  if (auth) await signOut(auth);
  await clearAuthSession();
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void) {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      await clearAuthSession();
      callback(null);
      return;
    }
    const token = await user.getIdToken();
    const mapped = mapUser(user);
    await saveAuthSession(token, mapped);
    callback(mapped);
  });
}
