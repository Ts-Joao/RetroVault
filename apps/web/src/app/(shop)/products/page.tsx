'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaSearch, FaHeart } from 'react-icons/fa'

import FavoriteButton from '@/components/Favoritos/ButtonFavorites'
import { getProducts } from '@/lib/services/product.service'
import { searchProducts } from '@retrovault/core'
import { useFavoritesStore } from '@retrovault/store'
import type { Product } from '@retrovault/core'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { setLoading: setFavoritesLoading } = useFavoritesStore()

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      setFavoritesLoading(false)
      try {
        const data = await getProducts()
        if (alive) setProducts(data)
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [setFavoritesLoading])

  const filtered = useMemo(() => searchProducts(products, { query }), [products, query])

  return (
    <div className="flex-1 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produtos"
            className="w-[320px] max-w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaHeart className="text-red-500" />
          {products.length} itens carregados
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-gray-500">Carregando produtos...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <article key={product.id} className="rounded-lg bg-white p-4 shadow-sm">
              <Link href={`/products/${product.id}/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                <div className="mb-3 aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                  {product.photos?.[0]?.url ? (
                    <Image src={product.photos[0].url} alt={product.name} width={600} height={450} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">Sem foto</div>
                  )}
                </div>
                <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">{product.name}</h2>
              </Link>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Preço</p>
                  <p className="text-lg font-bold text-gray-900">R$ {Number(product.price).toFixed(2)}</p>
                </div>
                <FavoriteButton productId={product.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
