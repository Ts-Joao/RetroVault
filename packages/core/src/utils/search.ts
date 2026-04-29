import { Product } from "../types/product"
import { mockProducts } from "../../../../apps/web/src/services/product"

export function searchProducts(query: string): Product[] {
  if (!query) return mockProducts

  const q = query.toLowerCase()

  return mockProducts.filter((product: Product) =>
    product.name.toLowerCase().includes(q) ||
    product.seller_id.toLowerCase().includes(q)
  )
}