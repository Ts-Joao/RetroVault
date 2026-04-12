import { create } from 'zustand'
import { CartItem, Product } from '@retrovault/core'

type CartStore = {
    items: CartItem[]
    setItems: (items: CartItem[]) => void
    increment: (productId: string) => void
    decrement: (productId: string) => void
    addItem: (product: Product) => void
    total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    setItems: (items) => set({ items }),

    addItem: (product: Product) => set((state) => {
        const existingItem = state.items.find(item => item.product.id === product.id);

        if (existingItem) {
            return {
                items: state.items.map(item =>
                    item.product.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                )
            };
        }

        return { items: [...state.items, { product, quantity: 1 }] };
    }),

    increment: (productId) => set((state) => ({
        items: state.items.map((item) =>
            item.product.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ),
    })),

    decrement: (productId) => set((state) => ({
        items: state.items.map((item) =>
            item.product.id === productId
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
        ),
    })),

    total: () =>
        get().items.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        ),
}));
