'use client'

import { useEffect } from 'react'
import { PiBag } from 'react-icons/pi'

import ProductCart from '@/components/product-cart/ProductCart'

import PaymentAndActionSelector from '@/components/layout/order-summary/PaymentAndActionSelector'
import CouponValidator from '@/components/layout/order-summary/CouponValidator'
import ShippingCalculator from '@/components/layout/order-summary/ShippingCalculator'
import OrderTotalSummary from '@/components/layout/order-summary/OrderTotalSummary'

import { useAuth } from '@/lib/context/auth.context'
import { useCartActionsStore } from '@/store/cart.store'
import { useCartStore } from '@retrovault/store'

export default function CartClient() {
    const { user } = useAuth()
    const { loadCart, incrementItem, decrementItem, loading } = useCartActionsStore()
    const { items } = useCartStore()

    useEffect(() => {
        if (!user?.sub) return
        loadCart(user.sub)
    }, [user?.sub, loadCart])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <p className="text-sm text-zinc-500 animate-pulse">Carregando carrinho...</p>
            </div>
        )
    }

    const validItems = items.filter(item => item && item.product)

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-center justify-center text-[#D9A128]">
                <PiBag className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Minha Sacola</h1>
                <p className="text-xs text-zinc-400 mt-0.5">Revise seus itens antes de prosseguir para o pagamento</p>
              </div>
            </div>

            {validItems.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-200 shadow-sm text-center px-4">
                    <div className="bg-zinc-50 p-5 rounded-full mb-4 text-zinc-300">
                      <PiBag className="text-4xl" />
                    </div>
                    <p className="text-zinc-700 font-bold text-lg">Seu carrinho está vazio</p>
                    <p className="text-sm text-zinc-400 mt-1 max-w-sm">Você ainda não adicionou nenhum produto.</p>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
                    {/* Lista de Produtos (Esquerda) */}
                    <div className="flex flex-col gap-4">
                        {validItems.map(item => (
                            <ProductCart
                                key={item.id}
                                product={item.product}
                                quantity={item.amount}
                                onIncrement={() => user?.sub && incrementItem(user.sub, item.id)}
                                onDecrement={() => user?.sub && decrementItem(user.sub, item.id)}
                            />
                        ))}
                    </div>

                    {/* Caixa de Checkout Reestruturada (Direita) */}
                    <aside className="sticky top-6 flex flex-col gap-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm font-chakra-petch">
                        <h3 className="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">Resumo do Pedido</h3>
                        
                        {/* 1. Bloco de Frete */}
                        <ShippingCalculator />

                        {/* 2. Bloco de Cupom */}
                        <CouponValidator />

                        {/* 3. Bloco de Totais de Preço */}
                        <OrderTotalSummary />

                        {/* 4. Bloco de Pagamento e Gatilho Final */}
                        <PaymentAndActionSelector itens={validItems} />
                    </aside>
                </div>
            )}
        </div>
    )
}