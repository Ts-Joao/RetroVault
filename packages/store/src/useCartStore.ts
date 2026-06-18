import { create } from "zustand";
import { CartItem } from "@retrovault/core";

type CartState = {
  items: CartItem[];
  total: number;
  itemCount: number;

  setCart: (items: CartItem[], total: number, itemCount: number) => void;

  clearCart: () => void;

  clearLocally: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  itemCount: 0,

  setCart: (items, total, itemCount) =>
    set({
      items: items.filter((item) => item?.product),
      total,
      itemCount,
    }),

  clearCart: () =>
    set({
      items: [],
      total: 0,
      itemCount: 0,
    }),

  clearLocally: () =>
    set((state) => ({
      items: state.items.filter((item) => item.product !== null),
      total: state.total,
      itemCount: state.itemCount,
    })),
}));
