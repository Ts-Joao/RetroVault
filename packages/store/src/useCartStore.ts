import { create } from 'zustand'
import { CartItem } from '@retrovault/core'

type CartStore = {
    items: CartItem[]
    total: number
    itemCount: number
    isLoading: boolean
    setCart: (items: CartItem[], total: number, itemCount: number) => void
    setItems: (items: CartItem[]) => void
    updateItemLocally: (itemId: string, amount: number) => void
    removeItemLocally: (itemId: string) => void
    clearLocally: () => void
    setLoading: (loading: boolean) => void
    computeTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,

    setCart: (items, total, itemCount) => set({ items, total, itemCount }),

    setItems: (items) => set({ items }),

    updateItemLocally: (itemId, amount) => set((state) => {
        if (amount <= 0) {
            return {
                items: state.items.filter((item) => item.id !== itemId),
            }
        }
        return {
            items: state.items.map((item) =>
                item.id === itemId ? { ...item, amount } : item
            ),
        }
    }),

    removeItemLocally: (itemId) => set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
    })),

    clearLocally: () => set({ items: [], total: 0, itemCount: 0 }),

    setLoading: (isLoading) => set({ isLoading }),

    computeTotal: () =>
        get().items.reduce(
            (acc, item) => acc + Number(item.price) * item.amount,
            0
        ),
}))
