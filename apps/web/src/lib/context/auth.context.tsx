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
import { useSession } from "@/hooks/use-session";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    accessToken,
    hydrated,
    setUser,
    setAccessToken,
    clearUser,
    setHydrated,
  } = useSession();

  const syncSession = useCallback(async (currentToken: string | null) => {
    if (!currentToken) {
      try {
        const refreshed = await refreshSession();
        const payload = decodeJwtPayload(refreshed.accessToken);
        
        if (payload) {
          setUser(payload);
          setAccessToken(refreshed.accessToken);
          setAccessTokenCookie(refreshed.accessToken);
          return;
        }
      } catch {
        clearUser();
        clearAccessTokenCookie();
        return;
      }
    }

    const payload = decodeJwtPayload(currentToken!);
    const isExpired = payload?.exp ? Date.now() >= payload.exp * 1000 : true;

    if (!payload || isExpired) {
      try {
        const refreshed = await refreshSession();
        const refreshedPayload = decodeJwtPayload(refreshed.accessToken);

        if (refreshedPayload) {
          setUser(refreshedPayload);
          setAccessToken(refreshed.accessToken);
          setAccessTokenCookie(refreshed.accessToken);
          return;
        }
      } catch {
        clearUser();
        clearAccessTokenCookie();
      }
      return;
    }

    setUser(payload);
    setAccessTokenCookie(currentToken!);
  }, [setUser, setAccessToken, clearUser]);

  const refresh = useCallback(async () => {
    await syncSession(accessToken);
  }, [syncSession, accessToken]);

  useEffect(() => {
    const run = () => {
      const tokenOnHydration = useSessionStore.getState().accessToken;
      syncSession(tokenOnHydration).finally(() => setHydrated(true));
    };

    if (useSessionStore.persist.hasHydrated()) {
      run();
    }

    const unsubscribe = useSessionStore.persist.onFinishHydration(run);
    return unsubscribe;
  }, [syncSession, setHydrated]);

  useEffect(() => {
    if (accessToken) {
      setAccessTokenCookie(accessToken);
    }
  }, [accessToken]);

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