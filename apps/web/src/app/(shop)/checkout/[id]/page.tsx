import { getProductById } from "@/services/product"
import { notFound } from "next/navigation"
import CheckoutClient from "@/components/checkout/checkoutProducts"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const product = await getProductById(id)

    if (!product) {
        return notFound()
    }

    return <CheckoutClient product={product} />
}
