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

  const favorited = favorites.includes(productId)

  const handleToggle = async () => {
    if (!user?.sub) return

    syncFavorite(productId, !favorited)

    try {
      await toggleFavoriteService(user.sub, productId)
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar produto:', error)
      syncFavorite(productId, favorited)
    }
  }

  return (
    <button onClick={handleToggle} className="transition-all duration-300 hover:scale-110 active:scale-90">
      <FaHeart className={`text-xl transition-all duration-300 ${favorited ? 'scale-125 text-red-500' : 'text-gray-400'}`} />
    </button>
  )
}
