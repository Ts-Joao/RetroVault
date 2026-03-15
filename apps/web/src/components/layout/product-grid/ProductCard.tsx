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
    const parcelaValor = formatador.format(product.installment_number)
    const [ reais, centavos ] = parcelaValor.split(',')

    return (
        <div className="p-2 bg-[#d9d9d9] max-w-40 min-w-40 md:max-w-55 rounded-2xl grid justify-center items-center justify-self-center gap-1 md:gap-2 font-chakra-petch text-xs md:text-lg">
            <div className="bg-white flex justify-center items-center h-40 md:w-full rounded-t-xl w-35">
                <Image src={product.photo} alt={product.name} width={100} height={50} className="bg-cover h-40 w-auto"/>
            </div>

            <h1 className="font-barlow-condensed text-lg md:text-2xl leading-none">{product.name}</h1>
            <p>Por <Link href={`/u/${product.seller}`} className="cursor-pointer">{product.seller}</Link></p>
            <span className="text-prim flex justify-end"><PiStarFill/><PiStarFill/><PiStarFill/><PiStarFill/><PiStarFill/></span>
            <div className="text-[16px] flex justify-between">
                <p className="font-medium text-sm md:font-semibold md:text-xl">R$ {formatador.format(product.price)}</p>
                <div className="flex gap-1 justify-end items-baseline">
                    <p className="text-sm md:text-xl">{product.installment_amount}x</p>
                    <span className="text-xs md:text-sm flex">R$ {reais}, <p className="text-[10px] flex items-stretch">{centavos}</p></span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1 md:gap-2 text-center">
                <Link href={`/checkout/${product.id}`} className="bg-third rounded-md px-2 py-1 cursor-pointer w-full text-xs md:text-[14px]">
                <p>Compra Agora</p>
                </Link>
                <button className="bg-third p-1 rounded-md md:rounded-lg cursor-pointer">
                    <PiBag className="text-[15px] md:text-lg"/>
                </button>
            </div>
        </div>
    )
}