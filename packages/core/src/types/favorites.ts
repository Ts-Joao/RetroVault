import { Product } from "./product";

export interface Favorite {
    userId: string,
    id: string,
    productId: string;
    product: Product;
}