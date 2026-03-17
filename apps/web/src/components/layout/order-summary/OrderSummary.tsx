import { Product } from '@retrovault/shared'
import Link from 'next/link'

export default function Ordersummary({product}: {product: Product}) {
    const total = product.price

    return (
        <div className='flex flex-col gap-10 justify-end'>
            <div className='grid bg-[#d9d9d9] px-3 py-2 rounded-lg'>
                <h1>Cupom:</h1>
                <input type="text" placeholder='Insira o Cupom' className='flex bg-white w-full justify-self-center rounded-lg py-1 px-2 focus:outline-none' />
            </div>
            <div className='bg-[#d9d9d9] px-3 py-2 rounded-lg'>
                <p>Produto: <span className='text-prim'>+ {product.price}</span></p>
                <p>Frete: <span className='text-prim'>+ 0,00</span></p>
                <p>Cupom: <span className='text-[#168634]'>- 0,00</span></p>
                <h1>Total <span>{total}</span></h1>
            </div>
            <div className='bg-[#d9d9d9]'>
                <h1>Forma de pagamento</h1>
            </div>
            <Link href='/' className='bg-[#F4BB2A] text-center text-xl rounded-lg'>
                <button className='cursor-pointer px-20 py-2'>Continuar Comprar</button>
            </Link>
        </div>
    )
}