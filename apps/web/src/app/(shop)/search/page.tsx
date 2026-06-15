'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Product } from '@retrovault/core'

import SearchFilters from '@/components/SearchFilters/SearchFilters'
import ProductGrid from '@/components/layout/product-grid/ProductGrid'
import { getProducts } from '@/lib/services/product.service'
import { searchProducts } from '@retrovault/core'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<Product[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [type, setType] = useState('')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      const products = await getProducts().catch(() => [])
      const data = searchProducts(products, {
        query,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        type,
        genre,
      })
      if (alive) {
        setResults(data)
        setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [query, minPrice, maxPrice, type, genre])

  return (
    <div className="flex-1 p-5">
      <h1 className="m-6 text-2xl font-bold">Resultados para: "{query}"</h1>

      <section className="m-6 flex items-start gap-5">
        <SearchFilters
          minPrice={minPrice}
          maxPrice={maxPrice}
          type={type}
          genre={genre}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setType={setType}
          setGenre={setGenre}
        />

        {loading ? (
          <p>Carregando...</p>
        ) : results.length === 0 ? (
          <p>Nenhum resultado encontrado</p>
        ) : (
          <ProductGrid products={results} />
        )}
      </section>
    </div>
  )
}
