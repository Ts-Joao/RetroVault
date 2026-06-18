import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { JwtPayload } from '@retrovault/core'

type SessionStore = {
  user: JwtPayload | null
  accessToken: string | null
  hydrated: boolean
  setUser: (user: JwtPayload | null) => void
  setAccessToken: (token: string | null) => void
  clearUser: () => void
  setHydrated: (hydrated: boolean) => void
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hydrated: false,
      setUser: (user) => set({ user, hydrated: true }),
      setAccessToken: (accessToken) => set({ accessToken, hydrated: true }),
      clearUser: () => set({ user: null, accessToken: null, hydrated: true }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'retrovault-session',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
)
