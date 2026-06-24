import create from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../lib/api";

const STORAGE_KEY = "@auth_token";

type Profile = { id: string; name: string; email: string } | null;

type AuthState = {
  token: string | null;
  profile: Profile;
  initializing: boolean;
  initialize: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  profile: null,
  initializing: false,
  initialize: async () => {
    set({ initializing: true });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        // keep token across reloads; if profile fetch fails, keep token and leave profile null
        set({ token: stored, profile: null });
        try {
          const user = await api.getProfile();
          set({ profile: user });
        } catch (_) {
          // don't remove token here — user should remain logged in until they explicitly logout
          set({ profile: null });
        }
      } else {
        // try refresh using server cookie
        try {
          const refreshed = await api.refresh();
          if (refreshed) {
            await AsyncStorage.setItem(STORAGE_KEY, refreshed);
            set({ token: refreshed, profile: null });
            try {
              const user = await api.getProfile();
              set({ profile: user });
            } catch (_) {
              // keep refreshed token; profile may load later or on demand
              set({ profile: null });
            }
          }
        } catch (_) {
          // ignore
        }
      }
    } finally {
      set({ initializing: false });
    }
  },
  login: async (token: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, token);
    set({ token, profile: null });
    try {
      const user = await api.getProfile();
      set({ profile: user });
    } catch (_) {
      // if profile fetch fails right after login, keep token and leave profile null
      set({ profile: null });
    }
  },
  logout: async () => {
    const token = get().token;
    try {
      if (token) await api.logout(token);
    } catch (e) {
      // ignore network errors
    } finally {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ token: null, profile: null });
    }
  },
}));

export default useAuthStore;
