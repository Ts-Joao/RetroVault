export const dynamic = 'force-dynamic'

import CategoryBar from "@/components/layout/category/CategoryBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getActiveProducts } from "@/lib/services/product.service";
import { getUsers } from "@/lib/services/user.server";
import { PiMagnifyingGlassBold, PiPackageBold } from "react-icons/pi";

export default async function Home() {
  const products = await getActiveProducts()
  const user = await getUsers()

  return (
    <div className="flex flex-col gap-8 pb-16 font-chakra-petch bg-[#F4F4F6]">
      
      {/* Seção Hero com Barra de Pesquisa Integrada */}
      <section className="w-full bg-white border-b border-zinc-200/80 py-12 md:py-16">
        <div className="mx-auto w-[92%] max-w-7xl flex flex-col items-center text-center gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-black tracking-widest text-[#CD463A] bg-red-50 px-3 py-1 rounded-full">
              Retrovault Marketplace
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 uppercase tracking-tight max-w-2xl leading-none">
              Explore o Vault de Relíquias Digitais
            </h1>
            <p className="text-sm text-zinc-500 font-medium max-w-md mx-auto">
              Encontre produtos autênticos, raros e exclusivos validados pela nossa comunidade de operadores.
            </p>
          </div>

          {/* Barra de Pesquisa Coerente com a Identidade */}
          <form className="w-full max-w-xl relative group mt-2">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#CD463A] transition-colors">
              <PiMagnifyingGlassBold className="text-lg" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por produtos, códigos ou vendedores..." 
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-800 placeholder-zinc-400 uppercase tracking-wide focus:outline-none focus:bg-white focus:border-zinc-400 focus:shadow-sm transition-all duration-200"
            />
          </form>
        </div>
      </section>

      {/* Barra de Categorias com espaçamento isolado */}
      <div className="-mt-4">
        <CategoryBar />
      </div>

      {/* Vitrine Principal de Produtos */}
      <main className="mx-auto w-[92%] max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-5 bg-[#CD463A] rounded-full" />
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400">
            Catálogo Disponível ({products.length})
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {products.length ? (
            <div className="w-full">
              <ProductGrid products={products} users={user} />
            </div>
          ) : (
            <div className="text-center bg-white border border-zinc-200 rounded-2xl p-12 max-w-sm shadow-xs">
              <PiPackageBold className="mx-auto text-4xl text-zinc-300 mb-3 animate-pulse" />
              <p className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                Nenhum produto disponível no cofre neste momento.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}