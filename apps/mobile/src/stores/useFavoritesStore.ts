import { create } from "zustand";
import { Product } from "@retrovault/core";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../lib/favorite.service";

export type FavoriteItem = {
  id: string;
  createdAt: string;
  userId: string;
  productId: string;
  product: Product;
};

export type FavoritesState = {
  favorites: FavoriteItem[];
  loading: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const data = await getFavorites();
      set({ favorites: data });
    } catch (e) {
      console.error("Error fetching favorites:", e);
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (product: Product) => {
    const { favorites } = get();
    const isFavorited = favorites.some((f) => f.productId === product.id);

    try {
      if (isFavorited) {
        // Optimistic update: remove item immediately
        set({
          favorites: favorites.filter((f) => f.productId !== product.id),
        });
        await deleteFavorite(product.id);
      } else {
        const newFav = await addFavorite(product.id);
        set({
          favorites: [...favorites, newFav],
        });
      }
    } catch (e) {
      console.error("Error toggling favorite:", e);
      // Sync state back if network request failed
      try {
        const data = await getFavorites();
        set({ favorites: data });
      } catch (err) {
        // Ignore if user is not authenticated or server is down
      }
    }
  },
}));
