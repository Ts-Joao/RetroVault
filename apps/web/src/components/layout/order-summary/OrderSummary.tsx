'use client'

import { Product, useSelect } from '@retrovault/shared'
import Link from 'next/link'
import { PiPixLogoBold, PiCreditCardBold } from 'react-icons/pi'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaPix } from "react-icons/fa6";

export default function Ordersummary({product}: {product: Product}) {
    const { isOpen, selected, toggle, selectOption } = useSelect()
    let payment = ['PIX', 'Cartão de Débito', 'Cartão de Crédito']

    return (
        <div className='flex flex-col gap-10 justify-end'>
            <div className='grid bg-[#d9d9d9] px-3 py-2 rounded-lg'>
                <h1>Cupom:</h1>
                <input type="text" placeholder='Insira o Cupom' className='flex bg-white w-full justify-self-center rounded-lg py-1 px-2 focus:outline-none' />
            </div>
            <div className='bg-[#d9d9d9] px-3 py-2 rounded-lg flex flex-col justify-between h-35'>
                <div className='grid gap-0.5'>
                    <p className='flex justify-between'>Produto: <span className='text-prim'>+ {product.price}</span></p>
                    <p className='flex justify-between'>Frete: <span className='text-prim'>+ 0,00</span></p>
                    <p className='flex justify-between'>Cupom: <span className='text-[#168634]'>- 0,00</span></p>
                </div>
                <h1 className='flex justify-between text-xl'>Total <span>{product.price}</span></h1>
            </div>
            <div className='bg-[#d9d9d9] px-3 py-2 rounded-lg relative'>
                <h1>Forma de pagamento</h1>
                <button onClick={toggle} className='cursor-pointer bg-white w-full px-2 py-1 text-start rounded-lg flex items-center justify-between hover:bg-amber-50'>
                    {selected || 'Selecione'}
                    <div className='flex text-xl gap-2'>
                        {(selected == 'PIX') ? <PiPixLogoBold className='text-teal-800'/> : <PiCreditCardBold className='text-prim'/>}
                        {isOpen ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                    </div>
                </button>
                {isOpen && (
                    <ul className="absolute bottom-8 left-3 mb-1 bg-white rounded-t-lg z-10 w-[93%]">
                        {payment.filter((item) => item !== selected).map(opt => (
                            <li key={opt} onClick={() => selectOption(opt)} className='cursor-pointer px-2 py-1 hover:bg-amber-50'>
                                {opt}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Link href='/' className='bg-[#F4BB2A] text-center text-xl rounded-lg'>
                <button className='cursor-pointer px-20 py-2'>Continuar Comprar</button>
            </Link>
        </div>
    )
}