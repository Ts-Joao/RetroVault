import Link from "next/link";
import Image from "next/image"
import { PiBag } from "react-icons/pi";
import StarRating from "@/components/StarRating";
import { Product, calculeCartInstallments, formatPrice, splitPrice } from "@retrovault/core"
import { mockUsers } from "@/services/user";

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {

    const seller = mockUsers.find(user => user.id === product.seller_id)

    const installments = calculeCartInstallments([{
        price: product.price,
        quantity: 1,
        max_installments: product.max_installments,
        free_installments: product.free_installments,
        min_installment_amount: product.min_installment_amount,
        monthly_interest_rate: product.monthly_interest_rate,
    }])

    const best = installments.at(-1) ?? {
        installment_amount: product.price,
        installments: 1,
    }

    const { units, cents } = splitPrice(best.installment_amount)

    return (
        <div className="p-2 bg-[#d9d9d9] max-w-40 min-w-40 md:max-w-55 rounded-2xl grid justify-center items-center justify-self-center gap-1 md:gap-2 font-chakra-petch text-xs md:text-lg">
            <div className="bg-white flex relative justify-center items-center h-35 w-35 md:w-full rounded-t-xl">
                <Image src={product.photo} alt={product.name} fill className="object-contain"/>
            </div>

            <h1 className="font-barlow-condensed text-lg md:text-2xl leading-none">{product.name}</h1>
            <p>Por <Link href={`/profile/${seller?.id}/${seller?.slug}`} className="cursor-pointer">{seller?.name}</Link></p>
            <span className="flex justify-end"><StarRating rating={product.rating}/></span>
            <div className="text-[16px] flex justify-between">
                <p className="font-medium text-sm md:font-semibold md:text-xl">R$ {formatPrice(product.price)}</p>
                <div className="flex gap-1 justify-end items-baseline">
                    <p className="text-sm md:text-xl">{product.max_installments}x</p>
                    <span className="text-xs md:text-sm flex">R$ {units}, <p className="text-[10px] flex items-stretch">{cents}</p></span>
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