import { useEffect, useState } from "react";
import {
  subscribeRestaurants,
  type Restaurant,
} from "../services/firebase/firestoreService";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeRestaurants((data) => {
      setRestaurants(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { restaurants, loading };
}

export type { Restaurant };
