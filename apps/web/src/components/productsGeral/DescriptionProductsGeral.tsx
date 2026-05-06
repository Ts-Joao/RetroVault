import { getProductById, getProducts } from '@/services/product'
import { Product} from "@retrovault/core"
import Image from "next/image"



type Props = {
    product: Product
    photo: string[ ]
}



export default async function DescriptionProductsGeral({ product, photo }: Props) {
    return (
        <div className=" flex justify-center ">  

            <div className=' flex gap-5 m-10  '>
                
                <Image src={ product.photo[0] } alt={product.name} width={300} height={500} />
            </div>


            {/* DIV da Descrição */}
            <div className=" p-5 m-10 bg-gray-300 rounded-lg shadow-md w-[300px] h-[300px] ">
                <h1> {product.name} </h1>
            </div>

        </div>   
    )


}