import { User } from "@retrovault/core";
import api from "../axios";

export async function getUsers(): Promise<User[]> {
    const { data } = await api.get('/users')
    return data
}

export async function getProductsBySellerId(id: string): Promise<User | undefined> {
    const { data } = await api.get(`/users/${id}`)
    return data
}

export async function getUserById(id: string): Promise<User | undefined> {
    const { data } = await api.get(`/users/${id}`)
    return data
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
    const { data } = await api.post('/users', { name, email, password })
    return data
}

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'ADMIN_123',
        slug: 'admin-123',
        email: 'admin@retro.com',
        photo: '/image/admin-pfp.jpg',
        products: []
    },
    {
        id: '2',
        name: 'Play Station',
        slug: 'play-station',
        email: 'play@station.com',
        photo: '/image/ps-pfp.png',
        products: ['1', '2']
    },
    {
        id: '3',
        name: 'Nintendo Oficial',
        slug: 'nintendo-oficial',
        email: 'nintendo@ofc.com',
        photo: '/image/nintendo-pfp.png',
        products: ['3']
    },
]