import { Product } from "@retrovault/shared"
import { PiBag, PiStarFill } from "react-icons/pi";
import Image from "next/image"
import Link from "next/link";

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const formatador = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return (
        <div className="p-2 bg-[#d9d9d9] max-w-50 rounded-2xl grid justify-center items-center justify-self-center gap-2 font-chakra-petch">
            <div className="bg-white flex justify-center rounded-t-xl">
                <Image src={product.photo} alt={product.name} width={80} height={30} className="bg-cover h-30 w-auto"/>
            </div>

            <h1 className="font-barlow-condensed text-2xl">{product.name}</h1>
            <p>Por <Link href={`/u/${product.seller}`} className="cursor-pointer">{product.seller}</Link></p>
            <span className="text-prim flex justify-end"><PiStarFill/><PiStarFill/><PiStarFill/><PiStarFill/><PiStarFill/></span>
            <div className="flex justify-between">
                <p>R$ {formatador.format(product.price)}</p>
                <div className="flex gap-1">
                    <p>{product.installment_amount}x</p>
                    <span>R$ {formatador.format(product.installment_number)}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-center">
                <Link href={`/checkout/${product.id}`} className="bg-third rounded-md px-2 py-1 cursor-pointer w-[90%] font-">
                <p>Compra Agora</p>
                </Link>
                <button className="bg-third p-1 rounded-lg cursor-pointer">
                    <PiBag size={24}/>
                </button>
            </div>
        </div>
    )
}