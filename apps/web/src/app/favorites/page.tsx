'use client'

import { useFavorites } from "../../context/FavoritesContext"

import { mockProducts }
from "@/services/product"

export default function FavoritesPage() {

   const { favorites } =
      useFavorites()

   const favoriteProducts =
      mockProducts.filter(product =>
         favorites.includes(product.id)
      )

   return (

      <div className="p-5">

         <h1 className="text-3xl mb-5">
            Favoritos
         </h1>

         <div className="grid gap-5">

            {favoriteProducts.map(product => (

               <div
                  key={product.id}
                  className="
                     bg-zinc-800
                     p-3
                     rounded-xl
                  "
               >
                  {product.name}
               </div>

            ))}

         </div>

      </div>
   )
}