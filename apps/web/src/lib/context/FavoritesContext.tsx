'use client'

import {
   createContext,
   useContext,
   useState,
   ReactNode
} from 'react'

type FavoriteContextType = {
   favorites: string[]
   toggleFavorite: (productId: string) => void
   isFavorite: (productId: string) => boolean
}

const FavoritesContext =
   createContext({} as FavoriteContextType)

type Props = {
   children: ReactNode
}

export function FavoritesProvider({
   children
}: Props) {

   const [favorites, setFavorites] =
      useState<string[]>([])

   function toggleFavorite(productId: string) {

      setFavorites(prev => {

         const exists =
            prev.includes(productId)

         if (exists) {
            return prev.filter(
               id => id !== productId
            )
         }

         return [...prev, productId]
      })
   }

   function isFavorite(productId: string) {
      return favorites.includes(productId)
   }

   return (

      <FavoritesContext.Provider
         value={{
            favorites,
            toggleFavorite,
            isFavorite
         }}
      >
         {children}
      </FavoritesContext.Provider>

   )
}

export function useFavorites() {
   return useContext(FavoritesContext)
}