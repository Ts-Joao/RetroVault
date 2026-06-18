import { create } from 'zustand'

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from '@/lib/services/cart.service'

import { useCartStore as useSharedCartStore } from '@retrovault/store'

type CartActions = {
  loading: boolean
  updating: boolean

  loadCart: (userId: string, silent?: boolean) => Promise<void>

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
    updating: false,

    loadCart: async (userId, silent = false) => {
      if (silent) {
        set({ updating: true })
      } else {
        set({ loading: true })
      }

      try {
        const data = await getCart()

        useSharedCartStore
          .getState()
          .setCart(
            data.cart?.cartItem ?? [],
            Number(data.total ?? 0),
            data.itemCount ?? 0
          )
      } finally {
        set({ loading: false, updating: false })
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
        itemId,
        item.amount + 1
      )

      await get().loadCart(userId, true)
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
          item.cartId,
          item.id
        )
      } else {
        await updateCartItem(
          item.id,
          item.amount - 1
        )
      }

      await get().loadCart(userId, true)
    },
  }))