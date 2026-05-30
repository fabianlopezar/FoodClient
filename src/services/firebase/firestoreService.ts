import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../config/firebase";

const FAVORITES = "favorites";
const CHAT = "chatMessages";
const RESTAURANTS = "restaurants";

export type Favorite = {
  id?: string;
  userId: string;
  recipeId: string;
  title: string;
  createdAt?: unknown;
};

export type ChatMessage = {
  id?: string;
  userId: string;
  displayName: string;
  text: string;
  createdAt?: unknown;
};

export type Restaurant = {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

export async function createFavorite(data: Omit<Favorite, "id">) {
  if (!db) throw new Error("Firestore no disponible");
  const ref = await addDoc(collection(db, FAVORITES), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, FAVORITES));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Favorite))
    .filter((f) => f.userId === userId);
}

export async function deleteFavorite(id: string) {
  if (!db) throw new Error("Firestore no disponible");
  await deleteDoc(doc(db, FAVORITES, id));
}

/** Transacción atómica: sincroniza favorito local con Firestore. */
export async function syncFavoriteTransaction(
  userId: string,
  recipeId: string,
  title: string
) {
  if (!db) throw new Error("Firestore no disponible");
  const favRef = doc(collection(db, FAVORITES));
  await runTransaction(db, async (transaction) => {
    transaction.set(favRef, {
      userId,
      recipeId,
      title,
      createdAt: serverTimestamp(),
    });
  });
  return favRef.id;
}

export function subscribeChatMessages(
  callback: (messages: ChatMessage[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, CHAT), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as ChatMessage)
    );
    callback(messages);
  });
}

export async function sendChatMessage(
  userId: string,
  displayName: string,
  text: string
) {
  if (!db) throw new Error("Firestore no disponible");
  await addDoc(collection(db, CHAT), {
    userId,
    displayName,
    text,
    createdAt: serverTimestamp(),
  });
}

export function subscribeRestaurants(
  callback: (restaurants: Restaurant[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured() || !db) {
    callback([
      { id: "demo-1", name: "Casa Verde", lat: 3.4516, lng: -76.532, address: "Cali, CO" },
      { id: "demo-2", name: "Sabor UAO", lat: 3.342, lng: -76.53, address: "Cali, CO" },
    ]);
    return () => {};
  }
  return onSnapshot(collection(db, RESTAURANTS), (snapshot) => {
    callback(
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Restaurant))
    );
  });
}

export async function upsertRestaurant(id: string, data: Omit<Restaurant, "id">) {
  if (!db) throw new Error("Firestore no disponible");
  await updateDoc(doc(db, RESTAURANTS, id), data);
}
