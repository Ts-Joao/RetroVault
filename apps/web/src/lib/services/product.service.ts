import { Product, ProductDetails, ProductPhoto } from "@retrovault/core"
import api from "../axios"

export async function createProduct(body: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data } = await api.post<Product>('/products', body)
  return data
}

export async function getProducts() {
  const { data } = await api.get<Product[]>('/products')
  return data
}

export async function getProductById(id: string) {
  const data = await api.get<Product>(`/products/${id}`)
  return data
}

export async function getProductsByUserId(sellerId: string) {
  const { data } = await api.get<Product[]>(`/products/${sellerId}`)
  return data
}

export async function getAllProductsBySellerId(sellerId: string) {
  const { data } = await api.get<Product[]>(`/products/${sellerId}`)
  return data
}

export async function getProductPhotos(productId: string) {
  const data = await api.get<ProductPhoto[]>(`/uploads/products/${productId}`)
  return data
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'EA Sport F1 25 - Play Station 5',
    price: 353.30,
    photos: ['/image/f1-25.webp'],
    seller_id: '2',
    rating: 4.5,
    max_installments: 12,
    free_installments: 10,
    min_installment_amount: 20,
    monthly_interest_rate: 0.02,
    shipping_cost: 0,
    type: ['game'],
    genre: ['racing', 'sports']
  },
  {
    id: '2',
    name: 'Shadow of the Colossus PS4 Remake',
    price: 154,
    photos: ['/image/shadow-of-the-colossus.png', '/image/sonic-x-shadow-generations.nintendo-switch.webp', '/image/shadow-of-the-colossus.png' ],
    seller_id: '2',
    rating: 4,
    max_installments: 6,
    free_installments: 3,
    min_installment_amount: 10,
    monthly_interest_rate: 0.03,
    shipping_cost: 20,
    type: ['game'],
    genre: ['action', 'adventure']
  },
  {
    id: '3',
    name: 'Pokemon Legends Z-A Nintendo Switch 2',
    price: 380.37,
    photos: ['/image/pokemon-legends-za.webp'],
    seller_id: '3',
    rating: 5,
    max_installments: 12,
    free_installments: 8,
    min_installment_amount: 20,
    monthly_interest_rate: 0.05,
    shipping_cost: 10,
    type: ['game'],
    genre: ['rpg', 'adventure']
  },
  {
    id: '4',
    name: 'Zelda Breath of the Wild Nintendo Switch',
    price: 409.11,
    photos: ['/image/zelda-breath-of-the-wild.webp'],
    free_installments: 2,
    max_installments: 6,
    min_installment_amount: 20,
    monthly_interest_rate: 0.02,
    seller_id: '3',
    rating: 5,
    shipping_cost: 10,
    type: ['game'],
    genre: ['action', 'adventure']
  },
  {
    id: '5',
    name: 'Metal gear solid V: The Phantom Pain PS4',
    price: 224.00,
    photos: ['/image/metal-gear-solid-v-the-phantom-pain.ps4.webp', '/image/metal-gear-solid-v-the-phantom-pain.ps4.webp', '/image/metal-gear-solid-v-the-phantom-pain.ps4.webp'],
    free_installments: 3,
    max_installments: 6,
    min_installment_amount: 20,
    monthly_interest_rate: 0.04,
    seller_id: '2',
    rating: 4.5,
    shipping_cost: 10,
    type: ['game'],
    genre: ['action', 'stealth']
  },
  {
    id: '6',
    name: 'Sonic x shadow generations Nintendo Switch',
    price: 251.00,
    photos: ['/image/sonic-x-shadow-generations.nintendo-switch.webp'],
    free_installments: 2,
    max_installments: 8,
    min_installment_amount: 10,
    monthly_interest_rate: 0.05,
    seller_id: '3',
    rating: 5,
    shipping_cost: 10,
    type: ['game'],
    genre: ['action', 'adventure']
  },
]