'use client'

import { useEffect } from 'react'
import { PiBag } from 'react-icons/pi'

import ProductCart from '@/components/product-cart/ProductCart'
import Ordersummary from '@/components/layout/order-summary/OrderSummary'

import { useAuth } from '@/lib/context/auth.context'

import { useCartActionsStore } from '@/store/cart.store'
import { useCartStore, useWalletStore } from '@retrovault/store'

export default function CartClient() {
    const { user } = useAuth()

    const {
        loadCart,
        incrementItem,
        decrementItem,
        loading,
    } = useCartActionsStore()

    const {
        items,
        total,
    } = useCartStore()

    const { wallet, history } = useWalletStore()

    useEffect(() => {
        if (!user?.sub) return

        loadCart(user.sub)
    }, [user?.sub, loadCart])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-lg text-gray-500">
                    Carregando carrinho...
                </p>
            </div>
        )
    }

    const validItems = items.filter(
        item => item && item.product
    )

    const shippingCost = validItems.reduce(
        (acc, item) =>
            acc +
            ((item.product.shipping_cost ?? 0) *
                item.amount),
        0
    )

    return (
        <div className="grid gap-3">
            <p className="flex items-center gap-1 text-xl font-semibold">
                <PiBag className="text-2xl" />
                Minha Sacola
            </p>

            <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-1 flex-col gap-3">
                    {validItems.length === 0 ? (
                        <p className="py-10 text-lg text-gray-500">
                            Seu carrinho está vazio.
                        </p>
                    ) : (
                        validItems.map(item => (
                            <ProductCart
                                key={item.id}
                                product={item.product}
                                quantity={item.amount}
                                onIncrement={() =>
                                    user?.sub &&
                                    incrementItem(
                                        user.sub,
                                        item.id
                                    )
                                }
                                onDecrement={() =>
                                    user?.sub &&
                                    decrementItem(
                                        user.sub,
                                        item.id
                                    )
                                }
                            />
                        ))
                    )}
                </div>

                {validItems.length > 0 && (
                    <div className="w-full lg:w-[380px]">
                        <Ordersummary
                            total={total}
                            shippingCost={shippingCost}
                            itens={validItems}
                            buyerWallet={wallet}
                            walletHistory={history}
                            walletLoading={false}
                            checkoutMode="cart"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}