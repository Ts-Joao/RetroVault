'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import FavoriteButton from '@/components/Favoritos/ButtonFavorites'
import StarRating from '@/components/StarRating'
import { useAuth } from '@/lib/context/auth.context'
import { getProductById } from '@/lib/services/product.service'
import { getUserByIdClient } from '@/lib/services/user.client'
import { getProductReviews } from '@/lib/services/review.service'
import { addCartItem } from '@/lib/services/cart.service'

interface ProductPageProps {
  params: Promise<{
    id: string
    slug: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string; slug: string } | null>(null)
  const [cep, setCep] = useState('')
  const [freteSelecionado, setFreteSelecionado] = useState<number | null>(null)
  const [isCalculado, setIsCalculado] = useState(false)

  const [product, setProduct] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        const resolvedParams = await params

        setUnwrappedParams(resolvedParams)

        const productData =
          await getProductById(
            resolvedParams.id
          )

        setProduct(productData)

        const [
          sellerData,
          reviewsData,
        ] = await Promise.all([
          getUserByIdClient(
            productData.sellerId
          ),
          getProductReviews(
            productData.id
          ),
        ])

        setSeller(sellerData)
        setTotalReviews(
          reviewsData.length
        )
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params])


  const opcoesFrete = [
    { id: 'sedex', nome: 'SEDEX (Expresso)', valor: 22.50, prazo: '2 a 4 dias úteis' },
    { id: 'pac', nome: 'PAC (Normal)', valor: 12.90, prazo: '5 a 10 dias úteis' }
  ]

  const handleCalcularCep = (e: React.FormEvent) => {
    e.preventDefault()
    if (cep.length >= 8) {
      setIsCalculado(true)
      setFreteSelecionado(opcoesFrete[0].valor)
    }
  }

  const precoProduto = Number(product?.price || 0)
  const valorFrete = freteSelecionado ?? 0
  const precoTotal = precoProduto + valorFrete

  if (
    loading ||
    !unwrappedParams ||
    !product
  ) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f6]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-2 border-zinc-300 border-t-black"></div>
        <p className="font-chakra-petch text-zinc-600">Carregando produto...</p>
      </div>
    </div>
  )

  async function handleAddToCart() {
    try {
      if (!user?.sub) {
        return
      }

      await addCartItem(
        user.sub,
        product.id,
        1
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full bg-[#F4F4F6] font-chakra-petch min-h-screen text-zinc-900">
      <div className="mx-auto w-[92%] max-w-7xl py-10">

        {/* Grid Principal - Estilo Checkout Lado a Lado */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">

          {/* Coluna da Esquerda: Detalhes do Produto */}
          <main className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 md:p-8">
            <div className="grid gap-10 lg:grid-cols-[400px_1fr]">

              {/* Imagem do Produto */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-[350px]">
                  {product.photos?.[0]?.url ? (
                    <Image
                      src={product.photos?.[0]?.url}
                      alt={product.name}
                      fill
                      priority
                      sizes="400px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400">
                      Sem imagem
                    </div>
                  )}
                </div>
              </div>

              {/* Informações de Texto */}
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Produto Oficial</span>
                    <h1 className="text-4xl font-bold text-zinc-900 mt-1 leading-tight">
                      {product.name}
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
                      Vendido e entregue por <span className="font-semibold text-zinc-700">{seller?.name ?? 'Vendedor'}</span>
                    </p>

                    {/* Bloco de Avaliações Simplificado (Apenas Estrelas) */}
                    <div className="mt-4 flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg w-fit border border-zinc-100">
                      <StarRating rating={product.rating ?? 0} />
                      <span className="font-bold text-sm text-zinc-800 mt-0.5">
                        {product.rating ?? 0}
                      </span>
                      <span className="text-xs text-zinc-400 mt-0.5">
                        ({totalReviews} avaliações)
                      </span>
                    </div>
                  </div>

                  <FavoriteButton
                    productId={product?.id}
                  />
                </div>

                {/* Gêneros */}
                {product.genre?.length ? (
                  <div className="mt-6">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Gêneros</p>
                    <div className="flex flex-wrap gap-2">
                      {product.genre.map((genre: string) => (
                        <span key={genre} className="rounded-md bg-zinc-100 border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Tipo */}
                {product.type?.length ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Tipo</p>
                    <div className="flex flex-wrap gap-2">
                      {product.type.map((type: string) => (
                        <span key={type} className="rounded-md bg-zinc-100 border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Descrição */}
                {product.description && (
                  <div className="mt-6 border-t border-zinc-100 pt-6">
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-400">Descrição</h2>
                    <p className="leading-relaxed text-zinc-600 text-sm">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </main>

          {/* Coluna da Direita: Checkout Preview & Frete */}
          <aside className="sticky top-6 grid gap-6">

            {/* Bloco de Preview de Pagamento e Compra */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">Resumo do Pedido</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Produto</span>
                  <span>R$ {precoProduto.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Frete</span>
                  <span>{freteSelecionado !== null ? `R$ ${valorFrete.toFixed(2).replace('.', ',')}` : 'Calcular'}</span>
                </div>

                <div className="pt-3 border-t border-dashed border-zinc-200 flex justify-between items-end">
                  <span className="font-bold text-zinc-900 text-base">Total do Pedido</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#D33C2D]">
                      R$ {precoTotal.toFixed(2).replace('.', ',')}
                    </span>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wide font-bold">No Pix ou Boleto</p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="mt-6 space-y-2.5">
                <button className="w-full rounded-xl bg-[#D9A128] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 tracking-wide uppercase">
                  Comprar Agora
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 tracking-wide uppercase"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>

            {/* Bloco de Cálculo de Frete */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">Calcular Frete e Prazo</h3>

              <form onSubmit={handleCalcularCep} className="flex gap-2">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Digite seu CEP (Ex: 00000000)"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 font-sans"
                />
                <button type="submit" className="rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-zinc-800 transition">
                  Calcular
                </button>
              </form>

              {/* Lista de Resultados do Frete */}
              {isCalculado && (
                <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
                  {opcoesFrete.map((opcao) => (
                    <label
                      key={opcao.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${freteSelecionado === opcao.valor
                          ? 'border-[#D9A128] bg-amber-50/40'
                          : 'border-zinc-200 hover:bg-zinc-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="frete"
                          checked={freteSelecionado === opcao.valor}
                          onChange={() => setFreteSelecionado(opcao.valor)}
                          className="accent-[#D9A128] h-4 w-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-800">{opcao.nome}</p>
                          <p className="text-[11px] text-zinc-400">{opcao.prazo}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        R$ {opcao.valor.toFixed(2).replace('.', ',')}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </aside>
        </div>

        {/* Seção Inferior: Apenas Avaliações em Estrelas (Sem comentários textuais) */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Avaliações dos Clientes</h2>
          <p className="text-sm text-zinc-500 mb-6">Média de satisfação com base nas notas enviadas pelos compradores.</p>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-100 w-fit">
            <div className="text-center">
              <p className="text-5xl font-black text-zinc-900">{product.rating ?? 0}</p>
              <p className="text-xs text-zinc-400 font-medium mt-1">de 5.0 estrelas</p>
            </div>

            <div className="h-px sm:h-12 w-12 sm:w-px bg-zinc-200" />

            <div className="flex flex-col items-center sm:items-start gap-1">
              <StarRating rating={product.rating ?? 0} />
              <p className="text-xs font-semibold text-zinc-600 mt-1">
                {totalReviews} clientes avaliaram este produto positivamente.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}