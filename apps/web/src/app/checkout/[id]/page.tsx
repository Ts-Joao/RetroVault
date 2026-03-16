import Image from 'next/image'
import Footer from '@/components/layout/footer/Footer'
import Navbar from '@/components/layout/nav-bar/NavBar'
import { getProductById } from '@/services/product'
import CheckoutClient from './CheckoutClient'

interface CheckoutPageProps {
    params: Promise<{ id: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { id } = await params
    const product = await getProductById(id)

    if (!product)
        return <div>Produto não encontrado!</div>

    return (
        <div className='flex flex-col justify-between h-dvh font-chakra-petch'>
            <Navbar />
            <section className='flex flex-col px-30 gap-2'>
                <p><span className='font-semibold'>Checkout do produto:</span> {product?.name}</p>
                <CheckoutClient product={product} />
            </section>
            <Footer />
        </div>
    )
}