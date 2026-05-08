import { Favorite } from '@retrovault/core'

export async function getFavorites(): Promise<Favorite[]> {
    return mockFavorites
}

const mockFavorites: Favorite[] = [
    {
        id: "1",
        userId: "1",
        productId: "1"
    },
    {
        id: "2",
        userId: "1",
        productId: "3"
    }
]

export async function isFavorite(
   userId: string,
   productId: string
) {

   const favorites = await getFavorites()

   return favorites.some(
      favorite =>
         favorite.userId === userId &&
         favorite.productId === productId
   )
}


export async function toggleFavorite(
   userId: string,
   productId: string
) {

   const index = mockFavorites.findIndex(
      favorite =>
         favorite.userId === userId &&
         favorite.productId === productId
   )

   if (index !== -1) {

      mockFavorites.splice(index, 1)

      return false
   }


   mockFavorites.push({
      id: crypto.randomUUID(),
      userId,
      productId
   })

   return true
}