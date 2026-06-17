import { User } from "@retrovault/core"
import { create } from 'zustand'

type UserStore = {
  user: User | null
  isLoading: boolean

  setUser: (user: User | null) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isLoading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoading: false,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}))