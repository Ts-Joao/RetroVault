import { Favorite } from '@retrovault/core'
import api from '../axios'

export async function getFavorites(userId: string): Promise<Favorite[]> {
    const { data } = await api.get<Favorite[]>('/favorites', {
        headers: { 'user-id': userId }
    })
    return data ?? []
}

export async function isFavorite(userId: string, productId: string): Promise<boolean> {
    const { data } = await api.get<boolean>(`/favorites/${productId}`, {
        headers: { 'user-id': userId }
    })
    return data
}

export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
    const favorited = await isFavorite(userId, productId)
    if (favorited) {
        await api.delete(`/favorites/${productId}`, {
            headers: { 'user-id': userId }
        })
        return false
    } else {
        await api.post(`/favorites/${productId}`, {}, {
            headers: { 'user-id': userId }
        })
        return true
    }
}