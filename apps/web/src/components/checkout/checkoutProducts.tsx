'use client'

import {
    PiTruck,
    PiMoney,
    PiPlusSquare,
    PiMinusSquare
} from "react-icons/pi";
import Link from "next/link";
import Image from 'next/image';
import { getUserById } from "@/lib/services/user.service";
import StarRating from '@/components/StarRating';
import Ordersummary from '@/components/layout/order-summary/OrderSummary';
import { formatPrice, Product, splitPrice } from '@retrovault/core'
import { useQuantity } from "@retrovault/ui-hooks";

export default async function CheckoutClient({ product }: { product: Product }) {
    const { quantity, increment, decrement } = useQuantity()
    const total = product.price * quantity
    const { units, cents } = splitPrice(total)
    const seller = await getUserById(product.sellerId)

    const firstPhoto = product.photos?.[0]?.url || ''
    const imageUrl = firstPhoto.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${firstPhoto}` : firstPhoto

    return (
        <>
            {/* div central */}
            <div className='flex w-full font-chakra-petch gap-20'>

                {/* div principal */}
                <div className='bg-[#d9d9d9] flex p-3 rounded-lg lg:rounded-2xl'>
                    <div className='bg-white flex relative items-center justify-center rounded-lg lg:rounded-2xl w-50 h-50 md:w-120 md:h-120'>
                        <Image src={imageUrl} alt={product.name} fill className='object-contain' />
                    </div>
                    <div className='flex flex-col lg:px-7 py-2 lg:py-5 gap-13'>
                        <div className='flex flex-col gap-4'>
                            <h1 className='font-semibold text-3xl'>{product.name}</h1>
                            <p className='text-lg'><Link href={`/profile/${seller?.id}/${seller?.slug}`} >Vendido por {seller?.name}</Link></p>
                            <span className='text-lg'><StarRating rating={product.rating} /></span>
                        </div>

                        <div className='grid gap-3'>
                            <p className='flex items-center gap-5 text-md'><PiTruck className='text-prim lg:text-3xl' /> Frete:<span>Caraguatatuba - São Paulo</span></p>
                            <p className='flex items-center gap-5 text-md'><PiMoney className='text-prim lg:text-3xl' /> Frete:
                                <span>
                                    {(product.shipping_cost == 0) ? <span className="text-[#168634]">Grátis</span> : ` R$ ${formatPrice(product.shipping_cost)}`}
                                </span>
                            </p>
                        </div>

                        <div className='flex items-center gap-4 text-lg'>
                            <p>Quantidade:</p>
                            <button onClick={decrement} className='cursor-pointer'><PiMinusSquare /></button>
                            <span className='w-4 text-center inline-block'>{quantity}</span>
                            <button onClick={increment} className='cursor-pointer'><PiPlusSquare /></button>
                        </div>

                        <div className='grid gap-5 text-md'>
                            <div className='bg-gray-700 h-0.5 w-full'></div> {/* Separetor */}
                            <h1 className='flex text-3xl md:font-semibold'>
                                <span className='text-prim md:mr-3'>R$</span>{units}, <p className='text-third md:mr-3'>{cents}</p> à vista
                            </h1>
                        </div>
                    </div>
                </div>

                <div>
                    <Ordersummary total={total} shippingCost={product.shipping_cost} itens={[{ id: '', amount: quantity, price: product.price, cartId: '', productId: product.id, product }]} />
                </div>
            </div>
        </>
    )
}