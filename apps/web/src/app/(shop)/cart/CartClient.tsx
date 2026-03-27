'use client'

import { useEffect } from "react"
import Ordersummary from "@/components/layout/order-summary/OrderSummary"
import ProductCart from "@/components/product-cart/ProductCart"
import { useCartStore } from "@retrovault/store"
import { CartItem } from "@retrovault/core"
import { PiBag } from "react-icons/pi";

export default function CartClient({ cart }: { cart: CartItem[] }) {
    const { items, setItems, decrement, increment, total } = useCartStore()
    
    useEffect(() => {
        setItems(cart)
    }, [cart])

    return (
        <>
        <div className="grid gap-2">
                <p className="flex items-center gap-1 text-xl font-semibold "><PiBag className="text-2xl"/> Minha Sacola</p>
            <div className="flex gap-20">
                <div className="flex flex-col gap-3">
                    {items.map(item => (
                        <ProductCart key={item.product.id} product={item.product} quantity={item.quantity} onIncrement={() => increment(item.product.id)} onDecrement={() => decrement(item.product.id)}/>
                    ))}
                </div>
                <div>
                    <Ordersummary total={total()} shippingCost={cart.reduce((acc, item) => acc + item.product.shipping_cost, 0) * 1.2}/>
                </div>
            </div>

        </div>
        </>
    )
}