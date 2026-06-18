import { Favorite } from '@retrovault/core'
import api from '../axios'

export async function getFavorites(): Promise<Favorite[]> {
    const { data } = await api.get<Favorite[]>('/favorites')
    return data ?? []
}

export async function isFavorite(productId: string): Promise<boolean> {
    const { data } = await api.get<{ isFavorited: boolean }>(
        `/favorites/${productId}`
    )

    return data.isFavorited
}

export async function toggleFavorite(productId: string): Promise<boolean> {
    const favorited = await isFavorite(productId)

    console.log('favorited?', favorited)

    if (favorited) {
        console.log('DELETE')
        await api.delete(`/favorites/${productId}`)
        return false
    } else {
        console.log('POST')
        await api.post(`/favorites/${productId}`)
        return true
    }
}