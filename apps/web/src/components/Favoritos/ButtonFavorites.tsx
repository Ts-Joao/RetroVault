'use client'

import { FaHeart } from "react-icons/fa"
import { useFavorites } from "../../context/FavoritesContext"

type Props = {
   productId: string
}

export default function ButtonFavorites({
   productId
}: Props) {

   const {
      toggleFavorite,
      isFavorite
   } = useFavorites()

   const favorited =
      isFavorite(productId)

   return (

      <button
         onClick={() =>
            toggleFavorite(productId)
         }
         className="
            transition-all
            duration-300
            hover:scale-110
            active:scale-90
         "
      >

         <FaHeart
            className={`
               text-xl
               transition-all
               duration-300

               ${
                  favorited
                     ? 'text-red-500 scale-125'
                     : 'text-gray-400'
               }
            `}
         />

      </button>
   )
}