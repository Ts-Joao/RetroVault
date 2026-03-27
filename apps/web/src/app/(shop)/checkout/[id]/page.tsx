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
        <div className='flex items-center font-chakra-petch overflow-y-auto h-full'>
            <section className='flex flex-1 justify-center gap-20'>
                <div className='flex flex-col justify-center-safe h-full'>
                    <p><span className='font-semibold'>Checkout do produto: </span>{product?.name}</p>
                    <CheckoutClient key={product.id} product={product} />
                </div>
            </section>
        </div>
    )
}