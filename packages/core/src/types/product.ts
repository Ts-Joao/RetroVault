import type { ProductPhoto } from "./productPhoto";

export interface Product {
    id: string
    slug: string
    name: string
    slug: string
    price: number
    photos: ProductPhoto[]
    sellerId: string
    rating: number
    max_installments: number
    free_installments: number
    monthly_interest_rate: number
    min_installment_amount: number
    shipping_cost: number
    type: string[]
    genre: string[]
    cep: string
    city: string
    state: string
}

export interface ProductDetails extends Product {
  description: string;
  amount: number;
  comments: string;
  salesCount: number;
}
