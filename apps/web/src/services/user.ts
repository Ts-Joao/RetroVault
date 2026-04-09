import { User } from "@retrovault/core";

export async function getUsers(): Promise<User[]> {
    return mockUsers
}

export async function getUserById(id: string): Promise<User | undefined> {
    const users = await getUsers()
    return users.find(user => user.id === id)
}

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'ADMIN_123',
        slug: 'admin-123',
        email: 'admin@retro.com',
        photo: '/image/admin-pfp.jpg',
        products: [],
        password: 'adminTS'
    },
    {
        id: '2',
        name: 'Play Station',
        slug: 'play-station',
        email: 'play@station.com',
        photo: '/image/ps-pfp.png',
        products: ['1', '2'],
        password: 'playPae'
    },
    {
        id: '3',
        name: 'Nintendo Oficial',
        slug: 'nintendo-oficial',
        email: 'nintendo@ofc.com',
        photo: '/image/nintendo-pfp.png',
        products: ['3'],
        password: 'eomario'
    },
]