export type JwtPayload = {
    role: 'admin' | 'seller' | 'user',
    sub: string,
    email: string,
    slug: string
}