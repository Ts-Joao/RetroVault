
import Link from "next/link";
import Image, { StaticImageData } from "next/image"
import { PiBag } from "react-icons/pi";



type RecommentsProductsProps = {
    imgcapa: (string | StaticImageData),
    price: number,
    title: string,
    parcelas: number
    numparcelas: number
}



export default function RecommentsProducts({ imgcapa, price, title, parcelas, numparcelas }: RecommentsProductsProps){
    
   
    
    return(
        <>  
            <h1 className=" text-xl font-barlow-condensed  ml-[50]">Gostou? Veja outros semelhantes</h1>

            <div className="bg-[#dddddd] w-[1600] h-[250] m-auto mt-[20] rounded-xl flex font-barlow-condensed">

            <div className="w-[180] h-[230] bg-amber-100 rounded-xl m-4 flex flex-col">
                
                <div className="w-[160] h-[120] rounded-xl bg-white flex m-auto" >
                      <Image src={imgcapa} alt={title} className="w-[130] h-[100] bg-cover m-auto" />
                </div>

                <div className="flex flex-col ml-4">

                    <span className="text-md font-bold">{title}</span>

                   <div className="flex gap-2"> 
                    <span className="text-md font-bold">R${price}</span>
                    <span className="text-sm">ou {numparcelas}x de {parcelas}</span>
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