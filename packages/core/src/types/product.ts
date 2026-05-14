import type { ProductPhoto } from "./productPhoto"

export interface Product {
    id: string
    name: string
    price: number
    photos: ProductPhoto[]
    seller_id: string
    rating: number
    max_installments: number
    free_installments: number
    monthly_interest_rate: number
    min_installment_amount: number
    shipping_cost: number
    type: string[]
    genre: string[]
}

export interface ProductDetails extends Product {
    description: string
    amount: number
    comments: string
}