import { create } from "zustand";
import { CartItem } from "@retrovault/core";

type CartState = {
  items: CartItem[];
  total: number;
  itemCount: number;

  setCart: (items: CartItem[], total: number, itemCount: number) => void;

  clearCart: () => void;

  clearLocally: () => void;

  addItem: (product: CartItem["product"]) => void;

  increment: (itemId: string) => void;

  decrement: (itemId: string) => void;

  computeTotal: () => number;
};

const getQuantity = (item: CartItem) => item.quantity ?? item.amount ?? 0;

const normalizeItems = (items: CartItem[]) =>
  items
    .filter((item) => item?.product)
    .map((item) => ({
      ...item,
      quantity: getQuantity(item),
    }));

const getTotals = (items: CartItem[]) => {
  const normalized = normalizeItems(items);
  return {
    items: normalized,
    total: Number(
      normalized
        .reduce(
          (acc, item) => acc + Number(item.product.price) * getQuantity(item),
          0,
        )
        .toFixed(2),
    ),
    itemCount: normalized.reduce((acc, item) => acc + getQuantity(item), 0),
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  setCart: (items, total, itemCount) =>
    set({
      items: normalizeItems(items),
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

  addItem: (product) =>
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id,
      );
      const currentItems = [...state.items];

      if (existingIndex >= 0) {
        const existing = currentItems[existingIndex];
        currentItems[existingIndex] = {
          ...existing,
          amount: getQuantity(existing) + 1,
          quantity: getQuantity(existing) + 1,
        };
      } else {
        currentItems.push({
          id: `${product.id}-${Date.now()}`,
          cartId: "",
          productId: product.id,
          product,
          price: product.price,
          amount: 1,
          quantity: 1,
        } as CartItem);
      }

      return getTotals(currentItems);
    }),

  increment: (itemId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              amount: getQuantity(item) + 1,
              quantity: getQuantity(item) + 1,
            }
          : item,
      );
      return getTotals(updatedItems);
    }),

  decrement: (itemId) =>
    set((state) => {
      const updatedItems = state.items
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                amount: Math.max(getQuantity(item) - 1, 0),
                quantity: Math.max(getQuantity(item) - 1, 0),
              }
            : item,
        )
        .filter((item) => getQuantity(item) > 0);
      return getTotals(updatedItems);
    }),

  computeTotal: () =>
    get()
      .items.reduce(
        (sum, item) => sum + Number(item.product.price) * getQuantity(item),
        0,
      ),
}));
