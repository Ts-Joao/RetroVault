'use client'

import { useEffect } from 'react'
import { PiTruck, PiMoney, PiPlusSquare, PiMinusSquare, PiShieldCheckBold } from 'react-icons/pi'
import Link from 'next/link'
import Image from 'next/image'
import StarRating from '@/components/StarRating'

import ShippingCalculator from '@/components/layout/order-summary/ShippingCalculator'
import CouponValidator from '@/components/layout/order-summary/CouponValidator'
import OrderTotalSummary from '@/components/layout/order-summary/OrderTotalSummary'
import PaymentAndActionSelector from '@/components/layout/order-summary/PaymentAndActionSelector'

import { formatPrice, Product, splitPrice, User } from '@retrovault/core'
import { useQuantity } from '@retrovault/ui-hooks'
import { getWallet, getWalletHistory } from '@/lib/services/wallet.client'
import { useAuth } from '@/lib/context/auth.context'
import { useWalletStore, useCartStore } from '@retrovault/store'

type Props = {
  product: Product
  seller?: User
}

export default function CheckoutClient({ product, seller }: Props) {
  const { user } = useAuth()
  const { quantity, increment, decrement } = useQuantity()
  const { wallet, history, setWallet, setHistory, setLoading, isLoading } = useWalletStore()
  const total = product.price * quantity

  useEffect(() => {
    useCartStore.setState({ total: total })
  }, [total])

  const { units, cents } = splitPrice(total)

  const firstPhoto = product.photos?.[0]?.url || ''
  const imageUrl = firstPhoto.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${firstPhoto}` : firstPhoto

  useEffect(() => {
    if (!user?.sub) return
    let alive = true
    async function loadWallet() {
      setLoading(true)
      try {
        const [walletData, historyData] = await Promise.all([
          getWallet(user.sub),
          getWalletHistory(user.sub),
        ])
        if (!alive) return
        setWallet(walletData)
        setHistory(historyData)
      } finally {
        if (alive) setLoading(false)
      }
    }
    loadWallet()
    return () => { alive = false }
  }, [user?.sub, setWallet, setHistory, setLoading])

  const singleProductItem = [
    {
      id: 'single-checkout',
      amount: quantity,
      price: product.price,
      cartId: 'single',
      productId: product.id,
      product: product
    }
  ]

  return (
    <div className="mx-auto w-[95%] max-w-7xl py-8 font-chakra-petch space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-center justify-center text-[#D9A128]">
          <PiShieldCheckBold className="text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Finalizar Compra</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Revise os detalhes do produto e escolha sua forma de pagamento</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        {/* Lado Esquerdo: Detalhes do Produto */}
        <div className="flex flex-col md:flex-row bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm gap-6 items-center md:items-start">
          {/* Container da Imagem */}
          <div className="bg-zinc-50 flex relative items-center justify-center rounded-xl border border-zinc-100 w-48 h-48 md:w-64 md:h-64 shrink-0 overflow-hidden">
            <Image src={imageUrl} alt={product.name} fill className="object-contain p-2" priority />
          </div>

          {/* Informações */}
          <div className="flex flex-col flex-1 py-1 gap-5 w-full">
            <div className="space-y-1">
              <h1 className="font-bold text-2xl text-zinc-900 leading-tight">{product.name}</h1>
              <p className="text-sm text-zinc-500 font-sans">
                Vendido por:{' '}
                <Link href={`/profile/${seller?.id}/${seller?.slug}`} className="text-[#D9A128] font-bold font-chakra-petch hover:underline">
                  {seller?.name}
                </Link>
              </p>
              <div className="pt-1 block">
                <StarRating rating={product.rating} />
              </div>
            </div>

            {/* Grid informativo de frete nativo */}
            <div className="grid gap-2 border-t border-b border-zinc-100 py-3 font-sans text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <PiTruck className="text-zinc-400 text-lg shrink-0" />
                <span>Origem do estoque: <strong className="text-zinc-800 font-chakra-petch font-semibold">Caraguatatuba - São Paulo</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <PiMoney className="text-zinc-400 text-lg shrink-0" />
                <span>
                  Frete base anunciado:{' '}
                  {product.shipping_cost === 0 || product.shipping_cost === undefined || product.shipping_cost === null ? (
                    <span className="text-emerald-600 font-bold font-chakra-petch uppercase tracking-wider text-[10px]">Grátis</span>
                  ) : (
                    <strong className="text-zinc-800 font-chakra-petch font-bold text-sm">R$ {formatPrice(product.shipping_cost)}</strong>
                  )}
                </span>
              </div>
            </div>

            {/* Controles de Quantidade */}
            <div className="flex items-center justify-between bg-zinc-50/60 border border-zinc-200/60 rounded-xl px-4 py-2.5 w-full max-w-[220px]">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Quantidade:</span>
              <div className="flex items-center gap-3.5 text-xl text-zinc-700">
                <button onClick={decrement} className="cursor-pointer hover:text-zinc-900 transition active:scale-95"><PiMinusSquare /></button>
                <span className="w-5 text-center font-bold text-sm text-zinc-800">{quantity}</span>
                <button onClick={increment} className="cursor-pointer hover:text-zinc-900 transition active:scale-95"><PiPlusSquare /></button>
              </div>
            </div>

            {/* Preço de Referência do Lado Esquerdo */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">Subtotal do item</span>
              <h1 className="flex items-baseline text-2xl font-black text-zinc-900">
                <span className="text-sm font-bold text-zinc-400 mr-1">R$</span>
                {units}
                <span className="text-base font-bold text-zinc-500">,{cents}</span>
                <span className="text-xs font-normal text-zinc-400 ml-2 font-sans">à vista</span>
              </h1>
            </div>
          </div>
        </div>

        <aside className="sticky top-6 flex flex-col gap-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">Resumo do Pedido</h3>
          <ShippingCalculator />
          <CouponValidator />
          <OrderTotalSummary />
          <PaymentAndActionSelector itens={singleProductItem} />
        </aside>
      </div>
    </div>
  )
}