'use client'

import { FaHeart } from 'react-icons/fa'
import { useFavoritesStore } from '@retrovault/store'
import { useAuth } from '@/lib/context/auth.context'
import { toggleFavorite as toggleFavoriteService } from '@/lib/services/favorites.service'

type Props = {
  productId: string
}

export default function ButtonFavorites({ productId }: Props) {
  const { user } = useAuth()
  const { favorites, syncFavorite } = useFavoritesStore()

  const isFavorited = favorites.includes(productId)

  const handleToggle = async () => {
    if (!user?.sub) return

    syncFavorite(productId, !isFavorited)

    try {
      await toggleFavoriteService(productId)
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar produto:', error)

      syncFavorite(productId, isFavorited)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer p-1 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-zinc-100 transition hover:scale-105"
    >
      <FaHeart
        className={`text-xl transition-all duration-300 ${
          isFavorited
            ? 'scale-110 text-red-500'
            : 'text-gray-400'
        }`}
      />
    </button>
  )
}