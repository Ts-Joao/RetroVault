'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import FavoriteButton from '@/components/Favoritos/ButtonFavorites'
import StarRating from '@/components/StarRating'
import { useAuth } from '@/lib/context/auth.context'
import { getActiveProductById } from '@/lib/services/product.client'
import { getUserByIdClient } from '@/lib/services/user.client'
import { getProductReviews, createReview, userBoughtProduct, updateReview } from '@/lib/services/review.service' 
import { addCartItem } from '@/lib/services/cart.service'
import { useShippingStore } from '@/store/shipping.store'
import { formatPrice } from '@retrovault/core'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast-provider'
import { PiStarFill, PiPackageBold, PiShieldCheckBold } from 'react-icons/pi'

interface ProductPageProps {
  params: Promise<{
    id: string
    slug: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string; slug: string } | null>(null)
  const [freteSelecionado, setFreteSelecionado] = useState<number | null>(null)
  const [isCalculado, setIsCalculado] = useState(false)
  const [cep, setCep] = useState('');
  const { shipping, calculate, shippingLoading } = useShippingStore();

  const [product, setProduct] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [totalReviews, setTotalReviews] = useState(0)
  const [ratingValue, setRatingValue] = useState(0)
  const [salesCount, setSalesCount] = useState(0)
  const [hasPurchased, setHasPurchased] = useState(false) 
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const toast = useToast()

  useEffect(() => {
    async function load() {
      try {
        const resolvedParams = await params
        setUnwrappedParams(resolvedParams)

        const productData = await getActiveProductById(resolvedParams.id)
        setProduct(productData)

        const [sellerData, reviewsData] = await Promise.all([
          getUserByIdClient(productData.sellerId),
          getProductReviews(productData.id),
        ])

        setSeller(sellerData)
        setTotalReviews(reviewsData.length)
        setRatingValue(productData.rating ?? 0)
        setSalesCount(productData.salesCount ?? 0)

        if (user?.sub) {
          try {
            const purchased = await userBoughtProduct(user.sub, productData.id);
            setHasPurchased(purchased);
          } catch {
            setHasPurchased(false);
          }
        }

        if (user?.sub) {
          const existingReview = reviewsData.find((r: any) => r.userId === user.sub || r.buyerId === user.sub)
          if (existingReview) {
            setUserRating(existingReview.rating)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params, user])

  function handleCepChange(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');
    const formattedCep = onlyNumbers.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
    setCep(formattedCep)
  }

  const handleCalcularCep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cep.length >= 8) {
      setIsCalculado(true)
      await calculate(cep)
      setFreteSelecionado(shipping?.sedex.price || 0)
    }
  }

  const handleRateProduct = async (newStars: number) => {
    if (!user) {
      toast.error('Você precisa estar autenticado para realizar esta operação.')
      return
    }

    if (!hasPurchased) {
      toast.error('Avaliação bloqueada: Você só pode avaliar produtos que já foram entregues.')
      return
    }

    if (userRating === newStars) return

    try {
      if (userRating === 0) {
        await createReview(user.sub, product.id, newStars);
      } else {
        await updateReview(user.sub, product.id, newStars);
      }

      setRatingValue((prevMedia) => {
        const totalNotasAntigo = totalReviews;
        
        if (userRating === 0) {
          const novaMedia = ((prevMedia * totalNotasAntigo) + newStars) / (totalNotasAntigo + 1);
          setTotalReviews(prev => prev + 1);
          return Number(novaMedia.toFixed(1));
        } else {
          const novaMedia = ((prevMedia * totalNotasAntigo) - userRating + newStars) / totalNotasAntigo;
          return Number(novaMedia.toFixed(1));
        }
      });

      setUserRating(newStars);
      toast.success(`Avaliação de ${newStars} estrelas registrada com sucesso!`);
    } catch (err: any) {
      if (err?.response?.status === 409 || err?.status === 409) {
        toast.error('Você já avaliou este produto anteriormente.');
      } else {
        toast.error('Falha ao registrar avaliação.');
      }
    }
  }

  const precoProduto = Number(product?.price || 0)
  const valorFrete = freteSelecionado ?? 0
  const precoTotal = precoProduto + valorFrete

  if (loading || !unwrappedParams || !product) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f6]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-2 border-zinc-300 border-t-black"></div>
        <p className="font-chakra-petch text-zinc-600">Sincronizando dados...</p>
      </div>
    </div>
  )

  const image = `${process.env.NEXT_PUBLIC_API_URL}${product.photos?.[0]?.url}`

  return (
    <div className="w-full bg-[#F4F4F6] font-chakra-petch min-h-screen text-zinc-900">
      <div className="mx-auto w-[92%] max-w-7xl py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          
          <div>
            <main className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 md:p-8">
              <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
                
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 flex items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[350px]">
                    {product.photos?.[0]?.url ? (
                      <Image src={image} alt={product.name} fill priority sizes="400px" className="object-contain" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400">Sem imagem</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Produto Oficial</span>
                      <h1 className="text-4xl font-bold text-zinc-900 mt-1 leading-tight">{product.name}</h1>
                      
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-bold uppercase tracking-wide">
                        <PiPackageBold />
                        <span>{salesCount} unidades adquiridas pelo sistema</span>
                      </div>

                      <p className="mt-2 text-sm text-zinc-500">
                        Vendido e entregue por
                        <Link className="text-zinc-700 font-semibold ml-1" href={`/profile/${seller?.id}/${seller?.slug}`}>
                          {seller?.name ?? 'Vendedor'}
                        </Link>
                      </p>

                      <div className="mt-4 flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg w-fit border border-zinc-100">
                        <StarRating rating={ratingValue} />
                        <span className="font-bold text-sm text-zinc-800 mt-0.5">{ratingValue}</span>
                        <span className="text-xs text-zinc-400 mt-0.5">({totalReviews} avaliações)</span>
                      </div>
                    </div>
                    <FavoriteButton productId={product?.id} />
                  </div>

                  {product.description && (
                    <div className="mt-6 border-t border-zinc-100 pt-6">
                      <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-400">Descrição</h2>
                      <p className="leading-relaxed text-zinc-600 text-sm">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* Seção Inferior de Avaliações */}
            <section className="mt-8 bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Avaliações dos Clientes</h2>
              <p className="text-sm text-zinc-500 mb-6">Média de satisfação com base nas notas enviadas pelos compradores legítimos.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-black text-zinc-900">{ratingValue}</p>
                    <p className="text-xs text-zinc-400 font-medium mt-1">de 5.0 estrelas</p>
                  </div>
                  <div className="h-12 w-px bg-zinc-200" />
                  <div className="flex flex-col gap-1">
                    <StarRating rating={ratingValue} />
                    <p className="text-xs font-semibold text-zinc-600 mt-1">({totalReviews} feedbacks computados)</p>
                  </div>
                </div>

                {/* Console de Avaliação Interativo */}
                <div className="border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                    Sua Classificação
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRateProduct(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={!hasPurchased}
                        className={`text-2xl transition-transform active:scale-90 ${
                          hasPurchased ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                      >
                        <PiStarFill 
                          className={star <= (hoverRating || userRating) ? "text-amber-400" : "text-zinc-200"} 
                        />
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                    <PiShieldCheckBold className={hasPurchased ? "text-emerald-500" : "text-zinc-400"} />
                    {hasPurchased 
                      ? "Avaliação desbloqueada - pedido entregue." 
                      : "Disponível apenas após a entrega do pedido."
                    }
                  </p>
                </div>

              </div>
            </section>
          </div>

          {/* Checkout Preview Lateral */}
          <aside className="sticky top-6 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-zinc-200">
              <h3 className="text-lg font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">Resumo do Pedido</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Produto</span>
                  <span>R$ {formatPrice(precoProduto)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Frete</span>
                  <span>{freteSelecionado !== null ? `R$ ${formatPrice(valorFrete)}` : 'Calcular'}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-zinc-200 flex justify-between items-end">
                  <span className="font-bold text-zinc-900 text-base">Total do Pedido</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#D33C2D]">R$ {formatPrice(precoTotal)}</span>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wide font-bold">No Pix ou Boleto</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <Link href={`/checkout/${product.id}`}>
                  <button className="w-full rounded-xl bg-[#D9A128] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 tracking-wide uppercase cursor-pointer mb-2">
                    Comprar Agora
                  </button>
                </Link>
                <button
                  onClick={async () => {
                    if (user?.sub) {
                      await addCartItem(product.id, 1)
                      toast.success('Produto adicionado ao carrinho!')
                    }
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 tracking-wide uppercase cursor-pointer"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}