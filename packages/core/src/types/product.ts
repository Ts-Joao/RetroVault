export interface Product {
    id: string
    name: string
    price: number
    photo: string
    seller: string
    rating: number
    installment_number: number
    installment_amount: number
    shipping_cost: number
}

export interface ProductDetails extends Product {
    description: string
    amount: number
    comments: string
}