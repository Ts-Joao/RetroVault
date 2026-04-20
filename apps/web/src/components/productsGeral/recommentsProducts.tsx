
import Link from "next/link";
import Image from "next/image"
import { PiBag } from "react-icons/pi";
import { Product } from "@retrovault/core";

type Props = {
    product : Product
}



export default function RecommentsProducts({ product }: Props){
    
    
   
    
    return(
        <>  
            <h1 className=" text-xl font-barlow-condensed  ml-[50]">Gostou? Veja outros semelhantes</h1>

            <div className="bg-[#dddddd] w-[1600] h-[250] m-auto mt-[20] rounded-xl flex font-barlow-condensed">

            <div className="w-[180] h-[230] bg-amber-100 rounded-xl m-4 flex flex-col">
                
                <div className="w-[160] h-[120] rounded-xl bg-white flex m-auto" >
                      <Image src={product.photo} alt={product.name} className="w-[130] h-[100] bg-cover m-auto" />
                </div>

                <div className="flex flex-col ml-4">

                    <span className="text-md font-bold">{product.name}</span>

                   <div className="flex gap-2"> 
                    <span className="text-md font-bold">R${product.price.toFixed(2)}</span>
                    <span className="text-sm">ou {product.max_installments}x de {product.min_installment_amount.toFixed(2)}</span>
                   </div> 
                </div>

                <div>
                    <Link href={'/products'} className="flex items-center font-barlow-condensed bg-third text-white rounded-md justify-center gap-2 w-[100] m-auto ">
                        <PiBag />
                        <span>Ver Produto</span>
                    </Link>
                </div>

            </div>
        </div>
        </>
    )
}