
'use client'

import { Product } from "@retrovault/core"
import Image from "next/image"
import { useState } from "react"

type Props = {
    product: Product
}

export default function DescriptionProductsGeral({ product }: Props) {

    const images = product.photo

    const [currentIndex, setCurrentIndex] = useState(0)

    if (images.length === 0) {
        return <div>Imagem não disponível</div>
    }


    return (
        <div className="flex justify-center">

            <div className="flex gap-5 m-10">

                {/* MINIATURAS */}
                <div className="flex flex-col gap-3">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`border-2 rounded-xl ${
                                currentIndex === index
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                width={70}
                                height={100}
                                className=" rounded-xl" 
                            />
                        </button>
                    ))}
                </div>

                <div>
                    <Image
                        src={images[currentIndex]}
                        alt={product.name}
                        width={300}
                        height={500}
                        className="rounded-xl"
                    />
                </div>

            </div>


            {/* DIV da Descrição */}
            <div className=" p-5 m-10 bg-gray-300 rounded-lg shadow-md w-[300px] h-[300px] ">
                <h1> {product.name} </h1>
            </div>

        </div>
    )


}