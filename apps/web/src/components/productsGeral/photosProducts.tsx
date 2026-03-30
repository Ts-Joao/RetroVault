'use client'

import { useState} from "react"
import Image, { StaticImageData } from "next/image"


type GaleryProps = {
    imagens : (string | StaticImageData)[]
}

export default function PhotosProducts({imagens}: GaleryProps ){

    
    const [mainImage, setMainImage] = useState<string | StaticImageData>(imagens[0])
    
    return(
        <>
          {/*Div das image para clicar e mudar o produto */}
           <div className={'flex m-5 rounded-xl w-[1150] h-[700]'} >
             <div className={'gap-15 flex flex-col m-10'} >
                {imagens.map((img,index) => (
                  <Image
                    key={index}
                    src={img}
                    alt="miniatura"
                    className={'w-[120] h-[150] rounded-md p-2'}
                    onClick={() => setMainImage(img)}
                    style={{
                        cursor: 'pointer',
                        border: mainImage === img ? '2px solid red' : '2px solid gray'
                    }}
                  />  
                ))}
             </div>

            <div className="flex m-4 w-[800] justify-center items-center ">
                <Image src={mainImage} alt='img poggers' className={'w-[700] h-[650] rounded-2xl'}/>
           </div>

           </div>
        </>
    )
}