'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/context/auth.context'
import { getFavorites } from '@/lib/services/favorites.service'
import { useFavoritesStore } from '@retrovault/store'

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  const {
    setFavorites,
    setLoading,
    setHydrated,
  } = useFavoritesStore()

  useEffect(() => {
    async function loadFavorites() {
      if (!user?.sub) {
        setFavorites([])
        setHydrated(true)
        return
      }

      try {
        setLoading(true)

        const favorites = await getFavorites()

        setFavorites(
          favorites.map(
            (favorite) => favorite.productId,
          ),
        )
      } catch (error) {
        console.error(
          'Erro ao carregar favoritos:',
          error,
        )
      } finally {
        setLoading(false)
        setHydrated(true)
      }
    }

    loadFavorites()
  }, [user])

  return <>{children}</>
}