'use client'

import Image from 'next/image';
import { Product, useQuantity } from '@retrovault/shared'
import { 
    PiTruck,
    PiMoney,
    PiPlusSquare,
    PiMinusSquare
} from "react-icons/pi"; 
import StarRating from '@/components/StarRating';

export default function CheckoutClient({product}: {product : Product}) {
    const { quantity, increment, decrement } = useQuantity()
    const total = product.price * quantity

    const formatador = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    const price = formatador.format(total)
    const [ reais, centavos ] = price.split(',')

    
    return (
        <>
        {/* div central */}
            <div className='bg-third flex w-full justify-self-center-safe font-chakra-petch'>

                {/* div principal */}
                <div className='bg-[#d9d9d9] flex p-3 rounded-lg lg:rounded-2xl'>
                    <div className='bg-white flex relative items-center justify-center rounded-lg lg:rounded-2xl w-50 h-50 md:w-120 md:h-120'>
                        <Image src={product.photo} alt={product.name} fill className='object-contain' />
                    </div>
                    <div className='lg:px-7 py-2 lg:py-5'>
                        <h1 className='font-semibold text-3xl'>{product.name}</h1>
                        <p>Por {product.seller}</p>
                        <span><StarRating rating={product.rating}/></span>

                        <p className='flex items-center gap-5'><PiTruck className='text-prim'/> Frete: <span>Caraguatatuba - São Paulo</span></p>
                        <p className='flex items-center gap-5'><PiMoney className='text-prim'/> Valor: 0,00</p>

                        <p className='flex items-center gap-2'>Quantidade: 
                            <button onClick={decrement} className='cursor-pointer'><PiMinusSquare/></button>{quantity}
                            <button onClick={increment} className='cursor-pointer'><PiPlusSquare/></button>
                        </p>

                        <div className='bg-gray-700 h-1px w-full'></div> {/* Separetor */}

                        <h1 className='flex text-2xl md:font-semibold'>
                            <span className='text-prim  md:mr-3'>R$</span>{reais}, <p className='text-third md:mr-3'>{centavos}</p> à vista</h1>
                    </div>
                </div>

                {/* div que agrupa as outras 4 opções sobre o pagamento */}
                <div className='grid'>
                    <div>
                        <h1>Cupom:</h1>
                    </div>
                    <div>
                        <h1>Total:</h1>
                    </div>
                    <div>
                        <h1>Método de pagamento:</h1>
                    </div>
                    <div>
                        <h1>Confirmar Compra</h1>
                    </div>
                </div>
            </div>
        </>
    )
}