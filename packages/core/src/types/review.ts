import { Product } from "./product";
import { User } from "./user";

export interface Review {
    id: string
    userId: string
    comments: string
    productId: string;
    rating: number
    user: User
    product: Product
}