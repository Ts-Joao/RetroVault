use client'

import { useEffect, useCallback } from "react"
import Ordersummary from "@/components/layout/order-summary/OrderSummary"
import ProductCart from "@/components/product-cart/ProductCart"
import { useCartStore, useWalletStore } from "@retrovault/store"
import { useAuth } from "@/lib/context/auth.context"
import { getCart, updateCartItem, removeCartItem } from "@/lib/services/cart.service"
import { getWallet, getWalletHistory } from "@/lib/services/wallet.client"
import { PiBag } from "react-icons/pi";

export default function CartClient() {
    const { user } = useAuth()
    const { items, setCart, updateItemLocally, removeItemLocally, computeTotal, isLoading, setLoading } = useCartStore()
    const { wallet, history, setWallet, setHistory, setLoading: setWalletLoading } = useWalletStore()

    const loadCart = useCallback(async () => {
        if (!user?.sub) return
        setLoading(true)
        setWalletLoading(true)
        try {
            const [data, walletData, historyData] = await Promise.all([
                getCart(user.sub),
                getWallet(user.sub),
                getWalletHistory(user.sub),
            ])
            setCart(data.cart.cartItem, Number(data.total), data.itemCount)
            setWallet(walletData)
            setHistory(historyData)
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error)
        } finally {
            setLoading(false)
            setWalletLoading(false)
        }
    }, [user?.sub, setCart, setLoading, setWallet, setHistory, setWalletLoading])

    useEffect(() => {
        loadCart()
    }, [loadCart])

    const handleIncrement = async (itemId: string, currentAmount: number) => {
        if (!user?.sub) return
        const newAmount = currentAmount + 1
        updateItemLocally(itemId, newAmount)
        try {
            await updateCartItem(user.sub, itemId, newAmount)
        } catch (error) {
            console.error('Erro ao incrementar item:', error)
            loadCart()
        }
    }

    const handleDecrement = async (itemId: string, currentAmount: number) => {
        if (!user?.sub) return
        const newAmount = currentAmount - 1

        if (newAmount <= 0) {
            const item = items.find(i => i.id === itemId)
            if (!item) return
            removeItemLocally(itemId)
            try {
                await removeCartItem(user.sub, item.cartId, itemId)
            } catch (error) {
                console.error('Erro ao remover item:', error)
                loadCart()
            }
            return
        }

        updateItemLocally(itemId, newAmount)
        try {
            await updateCartItem(user.sub, itemId, newAmount)
        } catch (error) {
            console.error('Erro ao decrementar item:', error)
            loadCart()
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-lg text-gray-500">Carregando carrinho...</p>
            </div>
        )
    }

    return (
        <div className="grid gap-2">
            <p className="flex items-center gap-1 text-xl font-semibold "><PiBag className="text-2xl"/> Minha Sacola</p>
            <div className="flex gap-20">
                <div className="flex flex-col gap-3">
                    {items.length === 0 ? (
                        <p className="py-10 text-lg text-gray-500">Seu carrinho está vazio.</p>
                    ) : (
                        items.map(item => (
                            <ProductCart
                                key={item.id}
                                product={item.product}
                                quantity={item.amount}
                                onIncrement={() => handleIncrement(item.id, item.amount)}
                                onDecrement={() => handleDecrement(item.id, item.amount)}
                            />
                        ))
                    )}
                </div>
                <div>
                    <Ordersummary
                        total={computeTotal()}
                        shippingCost={items.reduce((acc, item) => acc + (item.product.shipping_cost ?? 0), 0)}
                        itens={items}
                        buyerWallet={wallet}
                        walletHistory={history}
                        walletLoading={false}
                        checkoutMode="cart"
                    />
                </div>
            </div>
        </div>
    )
}
