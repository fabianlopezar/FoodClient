import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  subscribeToAuth,
  type AuthUser,
} from "../services/firebase/authService";
import { getAuthSession } from "../helpers/storage";
import { isFirebaseConfigured } from "../config/firebase";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  firebaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const session = await getAuthSession();
      if (mounted && session.user) setUser(session.user);
    }

    void hydrate();

    const unsubscribe = subscribeToAuth((nextUser) => {
      if (mounted) {
        setUser(nextUser);
        setLoading(false);
      }
    });

    if (!firebaseReady) setLoading(false);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [firebaseReady]);

  const login = useCallback(async (email: string, password: string) => {
    const mapped = await loginUser(email, password);
    setUser(mapped);
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const mapped = await registerUser(email, password, displayName);
      setUser(mapped);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      firebaseReady,
      login,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, loading, firebaseReady, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return ctx;
}
