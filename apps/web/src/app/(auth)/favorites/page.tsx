'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaHeart } from 'react-icons/fa'
import { PiBag } from 'react-icons/pi'

import Footer from '@/components/layout/footer/Footer'
import NavBar from '@/components/layout/nav-bar/NavBar'
import FavoriteButton from '@/components/Favoritos/ButtonFavorites'
import { useAuth } from '@/lib/context/auth.context'
import { getFavorites } from '@/lib/services/favorites.service'
import { getProducts } from '@/lib/services/product.service'
import { useFavoritesStore } from '@retrovault/store'
import type { Product } from '@retrovault/core'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites, setFavorites, isLoading, setLoading, hydrated } = useFavoritesStore()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let alive = true

    async function loadData() {
      setLoading(true)
      try {
        const [allProducts, userFavorites] = await Promise.all([
          getProducts(),
          user?.sub ? getFavorites(user.sub) : Promise.resolve([]),
        ])

        if (!alive) return
        setProducts(allProducts)
        if (user?.sub) {
          setFavorites(userFavorites.map((favorite) => favorite.productId))
        }
      } catch (error) {
        console.error('Erro ao carregar dados de favoritos:', error)
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadData()
    return () => {
      alive = false
    }
  }, [user?.sub, setFavorites, setLoading])

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [favorites, products]
  )

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FaHeart className="text-red-500 text-2xl" />
          <h1 className="text-3xl font-barlow-condensed">Meus Favoritos</h1>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-gray-200 p-5">
          {isLoading || !hydrated ? (
            <p className="py-10 text-center text-gray-500">Carregando favoritos...</p>
          ) : favoriteProducts.length === 0 ? (
            <p className="py-10 text-center text-gray-500">Você ainda não adicionou nenhum favorito.</p>
          ) : (
            favoriteProducts.map((product) => (
              <article key={product.id} className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {product.photos?.[0]?.url ? (
                    <Image
                      src={product.photos[0].url}
                      alt={product.name}
                      width={100}
                      height={150}
                      className="h-[150px] w-[100px] rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[150px] w-[100px] items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">Sem foto</div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                    <p className="text-sm text-gray-500">Preço: R$ {Number(product.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <FavoriteButton productId={product.id} />
                  <Link href={`/checkout/${product.id}`} className="inline-flex items-center gap-2 rounded bg-third px-3 py-2 text-xs text-black">
                    <PiBag /> Comprar agora
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
