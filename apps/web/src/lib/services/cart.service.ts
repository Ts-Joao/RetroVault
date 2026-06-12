import type { CartResponse, CartItem } from '@retrovault/core'
import api from '../axios'

export async function getCart(userId: string): Promise<CartResponse> {
    const { data } = await api.get<CartResponse>('/cart', {
        headers: { 'user-id': userId }
    })
    return data
}

export async function addCartItem(userId: string, productId: string, amount: number = 1): Promise<CartItem> {
    const { data } = await api.post<CartItem>('/cart', { productId, amount }, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function updateCartItem(userId: string, itemId: string, amount: number): Promise<CartItem> {
    const { data } = await api.patch<CartItem>(`/cart/${itemId}`, { amount }, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function removeCartItem(userId: string, cartId: string, itemId: string): Promise<void> {
    await api.delete(`/cart/${cartId}`, {
        headers: { 'user-id': userId },
        data: { id: itemId }
    })
}

export async function clearCart(userId: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>('/cart', {
        headers: { 'user-id': userId }
    })
    return data
}