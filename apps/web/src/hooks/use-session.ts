'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@retrovault/store';

export function useSession() {
  const store = useSessionStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return {
      user: null,
      accessToken: null,
      hydrated: false,
      setUser: () => {},
      setAccessToken: () => {},
      clearUser: () => {},
      setHydrated: () => {},
    };
  }

  return store;
}