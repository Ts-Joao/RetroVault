'use client'

import Image from 'next/image';
import { Product, useQuantity } from '@retrovault/shared'
import { 
    PiTruck,
    PiMoney,
    PiPlusSquare,
    PiMinusSquare
} from "react-icons/pi"; 

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
            <div className='bg-third flex w-[90%] justify-self-center-safe font-chakra-petch'>

                {/* div principal */}
                <div className='bg-[#d9d9d9] flex p-2 rounded-lg'>
                    <div className='bg-whte flex items-center justify-center'>
                        <Image src={product.photo} alt={product.name} width={100} height={60} className='lg:w-full' />
                    </div>
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.seller}</p>
                        <span>{product.rating}</span>

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