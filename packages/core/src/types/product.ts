export interface Product {
    id: string
    name: string
    price: number
    photo: string
    seller_id: string
    rating: number
    max_installments: number
    free_installments: number
    monthly_interest_rate: number
    min_installment_amount: number
    shipping_cost: number
}

export interface ProductDetails extends Product {
    description: string
    amount: number
    comments: string
}