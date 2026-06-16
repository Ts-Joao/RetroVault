'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaHeart } from 'react-icons/fa'

import { useAuth } from '@/lib/context/auth.context'
import { getFavorites } from '@/lib/services/favorites.service'
import { getProducts } from '@/lib/services/product.service'
import { useFavoritesStore } from '@retrovault/store'
import type { Product, User } from '@retrovault/core'
import ProductCard from '@/components/layout/product-grid/ProductCard'
import { getUsers } from '@/lib/services/user.server'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites, setFavorites, isLoading, setLoading, hydrated } = useFavoritesStore()
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    let alive = true

    async function loadData() {
      setLoading(true)
      try {
        const [allProducts, userFavorites] = await Promise.all([
          getProducts(),
          user?.sub ? getFavorites(user.sub) : Promise.resolve([]),
        ])

        const getUsers = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setUsers(await getUsers.json())

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
    <div className="w-full bg-[#F4F4F6] font-chakra-petch text-zinc-900">
      <main className="mx-auto w-[92%] max-w-7xl py-10">
        
        {/* Cabeçalho da Página */}
        <div className="mb-8 flex items-center gap-3 border-b border-zinc-200 pb-5">
          <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-center justify-center">
            <FaHeart className="text-red-500 text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Meus Favoritos</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Gerencie os itens que você salvou de toda a loja</p>
          </div>
        </div>

        {/* Estado de Carregamento / Vazio */}
        {isLoading || !hydrated ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-sm animate-pulse">Carregando seus favoritos...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-200 shadow-sm px-4 text-center">
            <div className="bg-zinc-50 p-4 rounded-full mb-3 text-zinc-300">
              <FaHeart className="text-3xl" />
            </div>
            <p className="text-zinc-700 font-medium">Sua lista de favoritos está vazia</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">Navegue pela loja e clique no coração para salvar produtos por aqui.</p>
          </div>
        ) : (
          /* Grid de Cards de Favoritos */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard product={product} users={users} key={product.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}