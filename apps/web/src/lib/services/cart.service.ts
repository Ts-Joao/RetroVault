import type { CartResponse, CartItem } from '@retrovault/core'
import api from '../axios'

export async function getCart(): Promise<CartResponse> {
    const { data } = await api.get<CartResponse>('/cart')
    return data
}

export async function addCartItem(productId: string, amount: number): Promise<CartItem> {
    const { data } = await api.post<CartItem>('/cart', { productId, amount })
    return data
}

export async function updateCartItem(itemId: string, amount: number): Promise<CartItem> {
    const { data } = await api.patch<CartItem>(`/cart/${itemId}`, { amount })
    return data
}

export async function removeCartItem(cartId: string, itemId: string): Promise<void> {
    await api.delete(`/cart/${cartId}`, {
        data: { id: itemId }
    })
}

export async function clearCart(cartId: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/cart/${cartId}`)
    return data
}