import { create } from 'zustand'
import { CartItem } from '@retrovault/core'

type CartStore = {
    items: CartItem[]
    total: number
    itemCount: number
    isLoading: boolean
    setCart: (items: CartItem[], total: number, itemCount: number) => void
    setItems: (items: CartItem[]) => void
    addItem: (product: CartItem['product'], quantity?: number) => void
    increment: (productId: string) => void
    decrement: (productId: string) => void
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

    addItem: (product, quantity = 1) =>
        set((state) => {
            const existingItem = state.items.find((item) => item.productId === product.id)

            if (existingItem) {
                return {
                    items: state.items.map((item) =>
                        item.productId === product.id
                            ? { ...item, amount: item.amount + quantity, quantity: item.quantity + quantity }
                            : item
                    ),
                }
            }

            const newItem: CartItem = {
                id: product.id,
                amount: quantity,
                quantity,
                price: product.price,
                cartId: product.id,
                productId: product.id,
                product,
            }

            return {
                items: [...state.items, newItem],
            }
        }),

    increment: (productId) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.productId === productId
                    ? { ...item, amount: item.amount + 1, quantity: item.quantity + 1 }
                    : item
            ),
        })),

    decrement: (productId) =>
        set((state) => ({
            items: state.items
                .map((item) =>
                    item.productId === productId
                        ? { ...item, amount: Math.max(item.amount - 1, 0), quantity: Math.max(item.quantity - 1, 0) }
                        : item
                )
                .filter((item) => item.amount > 0),
        })),

    updateItemLocally: (itemId, amount) => set((state) => {
        if (amount <= 0) {
            return {
                items: state.items.filter((item) => item.id !== itemId),
            }
        }
        return {
            items: state.items.map((item) =>
                item.id === itemId ? { ...item, amount, quantity: amount } : item
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
