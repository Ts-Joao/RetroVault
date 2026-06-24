'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Product } from '@retrovault/core'

import SearchFilters from '@/components/SearchFilters/SearchFilters'
import ProductCard from '@/components/layout/product-grid/ProductCard' // Importando o Card direto
import { getProducts } from '@/lib/services/product.client'
import { searchProducts } from '@retrovault/core'
import { PiMagnifyingGlassBold, PiSlidersBold } from 'react-icons/pi'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<Product[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [type, setType] = useState('')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)

      const products = await getProducts().catch(() => [])

      const data = searchProducts(products, {
        query,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        type,
        genre,
      })

      if (alive) {
        setResults(data)
        setLoading(false)
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [query, minPrice, maxPrice, type, genre])

  return (
    <main className="min-h-screen bg-[#F8F9FA] font-chakra-petch py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header de Resultados */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#CD463A] rounded-tl-2xl" />
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#CD463A]/10 rounded-xl text-[#CD463A]">
              <PiMagnifyingGlassBold className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">Módulo de Pesquisa</span>
              <h1 className="text-zinc-900 text-xl md:text-2xl font-black uppercase tracking-tight">
                Resultados para: <span className="text-[#CD463A]">"{query || 'Todos os produtos'}"</span>
              </h1>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-zinc-500 uppercase bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
              {loading ? 'Escaneando...' : `${results.length} registros encontrados`}
            </span>
          </div>
        </div>

        {/* Seção Principal de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Coluna de Filtros Lateral */}
          <aside className="lg:col-span-1 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm relative">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4 text-zinc-800">
              <PiSlidersBold className="text-lg text-[#CD463A]" />
              <h2 className="text-xs font-black uppercase tracking-wider">Parâmetros de Filtro</h2>
            </div>
            
            <SearchFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              type={type}
              genre={genre}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setType={setType}
              setGenre={setGenre}
            />
          </aside>

          {/* Área do Grid de Produtos Direto */}
          <section className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-20 text-center shadow-sm">
                <div className="w-8 h-8 border-4 border-[#CD463A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Sincronizando banco de dados...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-2 border-dashed border-zinc-200 p-20 text-center shadow-inner">
                <p className="text-zinc-400 font-bold uppercase text-sm tracking-wider">
                  Nenhum artefato corresponde aos critérios especificados.
                </p>
              </div>
            ) : (
              /* Renderização Direta: Reduzido de 5 para 4 colunas (md:grid-cols-4) para evitar quebras de layout */
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  )
}