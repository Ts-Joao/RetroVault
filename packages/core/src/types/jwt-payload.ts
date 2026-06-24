export type JwtPayload = {
    role: 'ADMIN' | 'SELLER' | 'BUYER' | 'admin' | 'seller' | 'user',
    sub: string,
    email: string,
    name?: string,
    slug: string,
    exp: number
}
