'use client'

import Link from "next/link"
import { formatPrice, Product, splitPrice } from '@retrovault/core'
import { PiBag } from "react-icons/pi";



export default  function DescriptionProducts({product}: { products : Product}){
    

    
    return(
        <>
            <div className="flex flex-col gap-[20] m-5 font-barlow-condensed">


                {/* description geral */}
                <div className="h-[365] w-[600] bg-[#e0e0e0] rounded-xl p-5">
                    <div> 
                        <span className={' text-3xl font-medium'}>{product.name} </span>
                        <div className={"flex gap-3 text-xl mt-2 mb-2"}>
                            
                        </div>

                        <div className={'flex gap-3 text-xl text-justify'} >
                            
                        </div>
                    </div>
                </div>


                {/* compra */}
                <div className="h-[365] w-[600] bg-[#e0e0e0] rounded-xl p-5">
                    
                    <div>

                        <div className="flex gap-2">

                            <span className="text-2xl font-bold">R$ {product.price},00</span>
                            <span className="text-xl">Á vista</span>

                        </div>

                        <div>
                            <span>OU </span>
                        </div>

                        <div className="flex gap-4 m-40">
                            <button className="flex items-center bg-third text-white text-2xl px-10 py-6 rounded-lg mt-5">
                                <span>Comprar</span>
                            </button>

                            <button className="flex items-center bg-third text-white bg-[#c0c0c0] text-2xl px-10 py-6 rounded-lg mt-5">
                                <PiBag/>
                            </button>

                        </div>

                    </div>


                </div>
            </div>
        </>
    )
}