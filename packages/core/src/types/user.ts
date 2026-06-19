export interface User {
    id: string
    name: string
    slug: string
    email: string
    photo?: string | null
    products?: string[]
    role: string
    defaultCep?: string | null
    createdAt?: number | string | undefined
}