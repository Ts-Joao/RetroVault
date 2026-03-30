"use client";

import ProductCard from "@/components/layout/product-grid/ProductCard";
import { getProductsByUserId, mockProducts } from "@/services/product";
import { User } from "@retrovault/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
  user: User;
};

export default function ProfileClient({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");

  return (
    <div className="min-h-screen bg-[#d9d9d9] font-chakra-petch">
      <div className="max-w-4xl mx-auto">

        {/* Card container */}
        <div className="relative mx-4 my-8 md:mx-8 md:my-12 rounded-2xl overflow-visible border border-white/10 shadow-2xl">

         {/* Banner */}
         <div className="relative w-full h-48 md:h-56 rounded-t-2xl overflow-hidden bg-bg]">
         <Image
            src="/image/placeholder-pfp.webp"
            fill
            sizes="100vw"
            className="object-contain"
            alt="Banner do perfil"
         />
         <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
         </div>

         {/* posicionamento */}
         <div className="absolute left-6 md:left-10 top-28 md:top-36 z-1">
         {/* container da imagem */}
         <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-[#d9d9d9] overflow-hidden shadow-xl bg-white">
            <Image
               src={user.photo}
               alt="Foto de perfil"
               fill
               className="object-contain"
            />
         </div>
         </div>

          {/* Área de info do usuário */}
          <div className="bg-bg px-6 md:px-10 pt-16 md:pt-20 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-black text-xl md:text-2xl font-bold tracking-tight">
                {user.name}
              </h1>
              <p className="text-black text-sm mt-1">13 vendas realizadas</p>
            </div>
            <button className="self-start sm:self-auto px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors text-black text-sm font-semibold cursor-pointer">
              Seguir loja
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-bg border-t border-white/10 flex">
            {(["products", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors relative 
                  ${activeTab === tab ? "text-amber-400 cursor-default" : "text-black cursor-pointer hover:text-gray-500" }`}
              >
                {tab === "products" ? "Produtos" : "Avaliações"}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
            {(user.products.length > 0) ?
              (<div className="bg-bg rounded-b-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 min-h-48">
                {/* Placeholders de produto — substituir por componente real */}
                {getProductsByUserId(user.id).map((p) => <ProductCard key={p.id} product={p}/>)}
              </div>)
              : <p className="bg-bg rounded-b-2xl p-6 md:p-8 lg:py-24 text-black text-center">Nenhum produto a venda</p>
             }


        </div>

      </div>
    </div>
  );
}