import { Review } from '@retrovault/core'
import api from '../axios'

export async function getProductReviews(productId: string): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/reviews/products/${productId}`)
    return data ?? []
}

export async function userBoughtProduct(userId: string, productId: string): Promise<boolean> {
    const { data } = await api.get<boolean>(`/reviews/products/${productId}/bought`, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function getUserReview(userId: string, productId: string): Promise<Review> {
    const { data } = await api.get<Review>(`/reviews/products/${productId}/me`, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function createReview(userId: string, productId: string, rating: number): Promise<Review> {
    const { data } = await api.post<Review>(`/reviews/products/${productId}`, { rating }, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function updateReview(userId: string, productId: string, rating: number): Promise<Review> {
    const { data } = await api.patch<Review>(`/reviews/products/${productId}`, { rating }, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function deleteReview(userId: string, productId: string): Promise<void> {
    await api.delete(`/reviews/products/${productId}`, {
        headers: { 'user-id': userId }
    })
}