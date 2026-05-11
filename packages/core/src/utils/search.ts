import { Product } from "../types/product"

type SearchFilters = {
  query?: string
  minPrice?: number
  maxPrice?: number
  type?: string
  genre?: string
}

export function searchProducts(
  products: Product[],
  filters: SearchFilters
): Product[] {

  const {
    query,
    minPrice,
    maxPrice,
    type,
    genre
  } = filters

  return products.filter((product: Product) => {

    const matchQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.seller_id.toLowerCase().includes(query.toLowerCase())

    const matchMinPrice =
      minPrice === undefined ||
      product.price >= minPrice

    const matchMaxPrice =
      maxPrice === undefined ||
      product.price <= maxPrice

    const matchType =
      !type ||
      product.type.includes(type)

    const matchGenre =
      !genre ||
      product.genre.includes(genre)

    return (
      matchQuery &&
      matchMinPrice &&
      matchMaxPrice &&
      matchType &&
      matchGenre
    )
  })
}