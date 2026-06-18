import api from "../axios"
import { Product, ProductDetails, ProductPhoto } from "@retrovault/core"

export async function createProduct(body: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const { data } = await api.post<Product>('/products', body)
  return data
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[] | undefined>('/products')
  return data ?? []
}

export async function getActiveProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[] | undefined>('/products/active')
  return data ?? []
}

export async function getProductById(id: string): Promise<ProductDetails> {
  const { data } = await api.get<ProductDetails>(`/products/${id}`)
  return data
}

export async function getActiveProductById(id: string): Promise<ProductDetails> {
  const { data } = await api.get<ProductDetails>(`/products/active/${id}`)
  return data
}

export async function getProductsBySellerId(sellerId: string): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/products/seller/${sellerId}`)
  return data ?? []
}

export async function getAllProductsBySellerId(sellerId: string): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/products/${sellerId}`)
  return data ?? []
}

export async function getProductPhotos(productId: string): Promise<ProductPhoto[]> {
  const { data } = await api.get<ProductPhoto[]>(`/uploads/products/${productId}`)
  return data ?? []
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getActiveProducts()
  return products?.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  ) ?? [];
}
