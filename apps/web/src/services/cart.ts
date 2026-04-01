import { CartItem } from '@retrovault/core'
import { mockProducts } from './product'

export async function getCart(): Promise<CartItem[]> {
    return mockCart
}

const mockCart: CartItem[] = [
    { product: mockProducts[0], quantity: 1},
    { product: mockProducts[1], quantity: 2},
    { product: mockProducts[2], quantity: 3},
]