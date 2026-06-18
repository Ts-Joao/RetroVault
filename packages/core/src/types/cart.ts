import { Product } from "./product";

export type CartItem = {
  id: string;
  amount: number;
  quantity?: number;
  price: number;
  cartId: string;
  productId: string;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  cartItem: CartItem[];
};

export type CartResponse = {
  cart: Cart;
  total: string;
  itemCount: number;
};
