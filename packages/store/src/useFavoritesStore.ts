import { create } from 'zustand'

type FavoritesStore = {
    favorites: string[]
    isLoading: boolean
    hydrated: boolean
    setFavorites: (favorites: string[]) => void
    syncFavorite: (productId: string, favorited: boolean) => void
    addFavoriteLocally: (productId: string) => void
    removeFavoriteLocally: (productId: string) => void
    setLoading: (loading: boolean) => void
    setHydrated: (hydrated: boolean) => void
    isFavorite: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
    favorites: [],
    isLoading: false,
    hydrated: false,

    setFavorites: (favorites) => set({ favorites, hydrated: true }),

    syncFavorite: (productId, favorited) => set((state) => {
        const nextFavorites = favorited
            ? Array.from(new Set([...state.favorites, productId]))
            : state.favorites.filter((id) => id !== productId)

        return { favorites: nextFavorites, hydrated: true }
    }),

    addFavoriteLocally: (productId) => set((state) => {
        if (state.favorites.includes(productId)) return state
        return { favorites: [...state.favorites, productId] }
    }),

    removeFavoriteLocally: (productId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== productId)
    })),

    setLoading: (isLoading) => set({ isLoading }),

    setHydrated: (hydrated) => set({ hydrated }),

    isFavorite: (productId) => get().favorites.includes(productId)
}))
