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
    name: 'Produto 1',
    price: 10,
    max_installments: 12,
    free_installments: 6,
    min_installment_amount: 10,
    monthly_interest_rate: 10,
    sellerId: '1',
    rating: 5,
    photos: [],
    genre: ['Ação'],
    type: ['Console'],
    shipping_cost: 0
  }
]