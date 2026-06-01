import { Product, ProductDetails, ProductPhoto } from "@retrovault/core"
import api from "../axios"
import { getServerApi } from "../axios.server"

export async function createProduct(body: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data } = await api.post<Product>('/products', body)
  return data
}

export async function getProducts() {
  const api = await getServerApi()
  const { data } = await api.get<Product[] | undefined>('/products')
  return data ?? []
}

export async function getProductById(id: string) {
  const api = await getServerApi()
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}

export async function getProductsBySellerId(sellerId: string) {
  const api = await getServerApi()
  const { data } = await api.get<Product[]>(`/products/seller/${sellerId}`)
  return data ?? []
}

export async function getAllProductsBySellerId(sellerId: string) {
  const { data } = await api.get<Product[]>(`/products/${sellerId}`)
  return data
}

export async function getProductPhotos(productId: string) {
  const api = await getServerApi()
  const { data } = await api.get<ProductPhoto[]>(`/uploads/products/${productId}`)
  return data
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts()
  return products?.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  ) ?? [];
}

