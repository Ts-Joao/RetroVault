export interface User {
    id: string
    name: string
    slug: string
    email: string
    profilePic?: { id: string, url: string } | null
    products?: string[]
    role: string
    defaultCep?: string | null
    createdAt?: number | string | undefined
}