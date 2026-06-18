"use client";

import type { JwtPayload } from "@retrovault/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { refreshSession } from "../services/auth.service";
import { useSessionStore } from "@retrovault/store";
import { clearAccessTokenCookie, setAccessTokenCookie } from "../session";

interface AuthContextType {
  user: JwtPayload | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refresh: async () => {},
});

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");

    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

async function syncTokenAndUser(
  token: string | null,
  setUser: (user: JwtPayload | null) => void,
  setAccessToken: (token: string | null) => void,
) {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);

  if (!payload?.sub || !payload.slug || !payload.name) {
    return false;
  }

  setUser(payload);
  setAccessToken(token);
  setAccessTokenCookie(token);

  return true;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    accessToken,
    hydrated,
    setUser,
    setAccessToken,
    clearUser,
    setHydrated,
  } = useSessionStore();

  const syncSession = useCallback(async () => {
    const restored = await syncTokenAndUser(
      accessToken,
      setUser,
      setAccessToken,
    );

    if (restored) {
      return;
    }

    try {
      const refreshed = await refreshSession();

      const refreshedRestored = await syncTokenAndUser(
        refreshed.accessToken,
        setUser,
        setAccessToken,
      );

      if (refreshedRestored) {
        return;
      }
    } catch {
      clearUser();
      clearAccessTokenCookie();
    }
  }, [accessToken, setUser, setAccessToken, clearUser]);

  const refresh = useCallback(async () => {
    await syncSession();
  }, [syncSession]);

  useEffect(() => {
    const run = () => syncSession().finally(() => setHydrated(true));

    if (useSessionStore.persist.hasHydrated()) {
      run();
    }

    const unsubscribe = useSessionStore.persist.onFinishHydration(run);

    return unsubscribe;
  }, [syncSession, setHydrated]);

  const value = useMemo(
    () => ({
      user,
      isLoading: !hydrated,
      refresh,
    }),
    [user, hydrated, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
