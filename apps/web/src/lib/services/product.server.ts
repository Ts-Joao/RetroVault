import 'server-only'
import { Product, ProductDetails, ProductPhoto } from "@retrovault/core"
import { getServerApi } from "../axios.server"

export async function getProducts(): Promise<Product[]> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<Product[] | undefined>('/products')
  return data ?? []
}

export async function getActiveProducts(): Promise<Product[]> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<Product[] | undefined>('/products/active')
  return data ?? []
}

export async function getProductById(id: string): Promise<ProductDetails> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<ProductDetails>(`/products/${id}`)
  return data
}

export async function getActiveProductById(id: string): Promise<ProductDetails> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<ProductDetails>(`/products/active/${id}`)
  return data
}

export async function getProductsBySellerId(sellerId: string): Promise<Product[]> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<Product[]>(`/products/seller/${sellerId}`)
  return data ?? []
}

export async function getAllProductsBySellerId(sellerId: string): Promise<Product[]> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<Product[]>(`/products/${sellerId}`)
  return data ?? []
}

export async function getProductPhotos(productId: string): Promise<ProductPhoto[]> {
  const serverApi = await getServerApi()
  const { data } = await serverApi.get<ProductPhoto[]>(`/uploads/products/${productId}`)
  return data ?? []
}
