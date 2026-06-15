import { create } from 'zustand'

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from '@/lib/services/cart.service'

import { useCartStore as useSharedCartStore } from '@retrovault/store'

type CartActions = {
  loading: boolean

  loadCart: (userId: string) => Promise<void>

  incrementItem: (
    userId: string,
    itemId: string
  ) => Promise<void>

  decrementItem: (
    userId: string,
    itemId: string
  ) => Promise<void>
}

export const useCartActionsStore =
  create<CartActions>((set, get) => ({
    loading: false,

    loadCart: async (userId) => {
      set({ loading: true })

      try {
        const data = await getCart(userId)

        useSharedCartStore
          .getState()
          .setCart(
            data.cart?.cartItem ?? [],
            Number(data.total ?? 0),
            data.itemCount ?? 0
          )
      } finally {
        set({ loading: false })
      }
    },

    incrementItem: async (
      userId,
      itemId
    ) => {
      const item =
        useSharedCartStore
          .getState()
          .items.find(
            i => i.id === itemId
          )

      if (!item) return

      await updateCartItem(
        userId,
        itemId,
        item.amount + 1
      )

      await get().loadCart(userId)
    },

    decrementItem: async (
      userId,
      itemId
    ) => {
      const item =
        useSharedCartStore
          .getState()
          .items.find(
            i => i.id === itemId
          )

      if (!item) return

      if (item.amount <= 1) {
        await removeCartItem(
          userId,
          item.cartId,
          item.id
        )
      } else {
        await updateCartItem(
          userId,
          item.id,
          item.amount - 1
        )
      }

      await get().loadCart(userId)
    },
  }))