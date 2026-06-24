import { create } from "zustand";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "@/lib/cart.service";
import { useCartStore } from "@retrovault/store";

export type CartActionsState = {
  loading: boolean;
  updating: boolean;
  loadCart: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  incrementItem: (itemId: string) => Promise<void>;
  decrementItem: (itemId: string) => Promise<void>;
};

export const useCartActionsStore = create<CartActionsState>((set) => ({
  loading: false,
  updating: false,

  loadCart: async () => {
    set({ loading: true });
    try {
      const data = await getCart();
      useCartStore
        .getState()
        .setCart(
          data.cart?.cartItem ?? [],
          Number(data.total ?? 0),
          data.itemCount ?? 0,
        );
    } finally {
      set({ loading: false, updating: false });
    }
  },

  addItem: async (productId) => {
    set({ updating: true });
    try {
      await addCartItem(productId, 1);
      await useCartActionsStore.getState().loadCart();
    } finally {
      set({ updating: false });
    }
  },

  incrementItem: async (itemId) => {
    const item = useCartStore.getState().items.find((i) => i.id === itemId);
    if (!item) return;

    set({ updating: true });
    try {
      await updateCartItem(itemId, (item.quantity ?? item.amount) + 1);
      await useCartActionsStore.getState().loadCart();
    } finally {
      set({ updating: false });
    }
  },

  decrementItem: async (itemId) => {
    const item = useCartStore.getState().items.find((i) => i.id === itemId);
    if (!item) return;

    set({ updating: true });
    try {
      const nextAmount = (item.quantity ?? item.amount) - 1;
      if (nextAmount <= 0) {
        await removeCartItem(item.cartId, item.id);
      } else {
        await updateCartItem(itemId, nextAmount);
      }
      await useCartActionsStore.getState().loadCart();
    } finally {
      set({ updating: false });
    }
  },
}));
