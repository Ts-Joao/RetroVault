import { Product } from "@retrovault/shared"
import { PiBag, PiStarFill } from "react-icons/pi";
import Image from "next/image"

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {
    return (
        <div className="p-2 bg-[#d9d9d9] max-w-[200px] rounded-2xl grid justify-center items-center gap-2">
            <div className="bg-white flex justify-center rounded-t-xl">
                <Image src={product.photo} alt={product.name} width={80} height={30} className="bg-cover h-30 w-auto"/>
            </div>

            <h1 className="mt-[-5px]">{product.name}</h1>
            <p>Por <span className="cursor-pointer">{product.seller}</span></p>
            <span className="text-prim flex justify-end"><PiStarFill/><PiStarFill/><PiStarFill/><PiStarFill/><PiStarFill/></span>
            <div className="flex justify-between">
                <p>R$ {product.price}</p>
                <div className="flex gap-1">
                    <p>{product.installment_amount}x</p>
                    <span>R$ {product.installment_number}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2">
                <input type="submit" value="Comprar agora" className="bg-third rounded-md px-2 py-1 cursor-pointer w-[90%]" />
                <button className="bg-third p-1 rounded-lg cursor-pointer">
                    <PiBag size={24}/>
                </button>
            </div>
        </div>
    )
}