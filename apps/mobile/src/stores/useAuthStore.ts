import create from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as api from '../lib/api'

const STORAGE_KEY = '@auth_token'

type Profile = { id: string; name: string; email: string } | null

type AuthState = {
  token: string | null
  profile: Profile
  initializing: boolean
  initialize: () => Promise<void>
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  profile: null,
  initializing: false,
  initialize: async () => {
    set({ initializing: true })
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        set({ token: stored })
        try {
          const user = await api.getProfile()
          set({ profile: user })
        } catch (_) {
          // ignore profile fetch errors
        }
      } else {
        // try refresh using server cookie
        try {
          const refreshed = await api.refresh()
          if (refreshed) {
            await AsyncStorage.setItem(STORAGE_KEY, refreshed)
            set({ token: refreshed })
            try {
              const user = await api.getProfile()
              set({ profile: user })
            } catch (_) {}
          }
        } catch (_) {
          // ignore
        }
      }
    } finally {
      set({ initializing: false })
    }
  },
  login: async (token: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, token)
    set({ token })
    try {
      const user = await api.getProfile()
      set({ profile: user })
    } catch (_) {
      set({ profile: null })
    }
  },
  logout: async () => {
    const token = get().token
    try {
      if (token) await api.logout(token)
    } catch (e) {
      // ignore network errors
    }
    await AsyncStorage.removeItem(STORAGE_KEY)
    set({ token: null, profile: null })
  },
}))

export default useAuthStore
