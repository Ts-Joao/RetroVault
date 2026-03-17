import Link from 'next/link'

export default function Ordersummary() {
    return (
        <div className='flex flex-col gap-10'>
            <div className='grid bg-[#d9d9d9] p-4 text'>
                <h1>Cupom:</h1>
                <input type="text" className='flex bg-white w-[90%] justify-self-center' />
            </div>
            <div className='bg-[#d9d9d9]'>
                <h1>Total</h1>
            </div>
            <div className='bg-[#d9d9d9]'>
                <h1>Forma de pagamento</h1>
            </div>
            <Link href='/' className='bg-third'>
                <button className=' cursor-pointer'>Continuar</button>
            </Link>
        </div>
    )
}