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
        <>
            <Navbar />
            <div>Checkout do produto: {product?.name}</div>
            <CheckoutClient product={product} />
            <Footer />
        </>
    )
}