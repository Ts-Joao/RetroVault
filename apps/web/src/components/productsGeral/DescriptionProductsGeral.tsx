import { getProductById, getProducts } from '@/services/product'
import { Product} from "@retrovault/core"
import Image from "next/image"



type Props = {
    product: Product
}



export default async function DescriptionProductsGeral({ product }: Props) {
    return (
        <div className="w-full flex gap-5 ">  

            {/* DIV das Imagens */}
            <div className="">
                <Image src={product.photo} alt={product.name} width={200} height={200}/>
            </div>
        

            {/* DIV da Descrição */}
            <div className="">
                <h1> {product.name} </h1>
            </div>

        </div>   
    )


}