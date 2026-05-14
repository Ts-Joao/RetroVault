'use client'

import { useFavorites } from "@/lib/context/FavoritesContext"
import Footer from "@/components/layout/footer/Footer"
import NavBar from "@/components/layout/nav-bar/NavBar"
import { FaHeart } from "react-icons/fa"
import Image from "next/image"
import FavoriteButton from "@/components/Favoritos/ButtonFavorites"

import { mockProducts }
   from "@/lib/services/product.service"
import { PiBag } from "react-icons/pi"
import Link from "next/dist/client/link"

export default function FavoritesPage() {

   const { favorites } =
      useFavorites()

   const favoriteProducts =
      mockProducts.filter(product =>
         favorites.includes(product.id)
      )

   return (

      <div className="min-h-screen flex flex-col">

         <NavBar />

         <main className="flex-1 p-5">

            <div className="flex gap-2 items-center">
               <FaHeart className="text-red-500 text-2xl" />
               <h1 className="text-3xl font-barlow-condensed">Meus Favoritos</h1>
            </div>


            <div className="flex flex-col gap-5 bg-gray-200 p-5 rounded-lg">

               {favoriteProducts.map(product => (

                  <div key={product.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">

                     <div className=" flex items-center gap-4 ">
                        <Image src={product.photo[0]} alt={product.name} width={100} height={150} className="rounded-lg" />
                        <h1 className="text-xl">{product.name}</h1>
                     </div>

                     <div className="flex flex-col items-end gap-8">

                        <FavoriteButton productId={product.id} />

                        <p className="text-amber-500 flex text-lg gap-1 ">Preço: R$ <p className=" text-red-500 ">{product.price.toFixed(2)}</p></p>

                        <div className="flex items-center justify-center gap-1 md:gap-2 text-center">
                           <Link href={`/checkout/${product.id}`} className="bg-third rounded-md px-2 py-1 cursor-pointer w-full text-xs md:text-[14px]">
                              <p>Compra Agora</p>
                           </Link>
                           <button className="bg-third p-1 rounded-md md:rounded-lg cursor-pointer">
                              <PiBag className="text-[15px] md:text-lg" />
                           </button>
                        </div>

                     </div>

                  </div>

               ))}

            </div>

         </main>
         <Footer />
      </div>
   )
}