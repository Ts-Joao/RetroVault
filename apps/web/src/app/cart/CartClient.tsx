'use client'

import { useEffect } from "react"
import Ordersummary from "@/components/layout/order-summary/OrderSummary"
import ProductCart from "@/components/product-cart/ProductCart"
import { CartItem, useCartStore } from "@retrovault/shared"
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
                    <Ordersummary total={total()} shippingCost={0}/>
                </div>
            </div>

        </div>
        </>
    )
}