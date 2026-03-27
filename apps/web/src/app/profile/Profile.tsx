"use client";

import Image from "next/image";

export default function Profile() {
 return (
  <>
   <div className="bg-amber-950 flex flex-col justify-center xl:mx-40 xl:my-15 lg:mx-40 lg:my-15 md:mx-40 md:my-15 md:border-2 border-[#BF372A] md:rounded-xl">
    <Image
     src="/image/placeholder-pfp.webp"
     width={100}
     height={100}
     className="w-full max-h-50 md:rounded-t-xl"
     alt="Banner do perfil"
    />

    <div className="bg-[#EEEEEE] py-2">
     <div className="ml-50 mb-20">
      <h1 className="xl:text-2xl lg:text-xl md:text-xl sm:text-lg font-bold">Blue ray 4ever</h1>
      <h2 className="xl:text-xl lg:text-lg md:text-md font-medium">total de vendas: 13</h2>
     </div>
     <div className="grid grid-cols-2 place-items-center sm:gap-5 xl:gap-10 md:gap-5 lg:gap-10px-50 text-2xl font-semibold">
        <button className="underline xl:text-2xl lg:text-xl md:text-xl sm:text-lg">Produtos</button>
        <button className="underline xl:text-2xl lg:text-xl md:text-xl sm:text-lg">Avaliações</button>
     </div>
    </div>
    <div className="bg-[#E3E2E2] grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 justify-items-center p-10 md:rounded-b-xl gap-y-3">
     <div className="flex bg-amber-200 h-20 w-20">a</div>
     <div className="flex bg-amber-200 h-20 w-20">a</div>
     <div className="flex bg-amber-200 h-20 w-20">a</div>
     <div className="flex bg-amber-200 h-20 w-20">a</div>
    </div>
    <Image
     src="/image/placeholder-pfp.webp"
     width={50}
     height={50}
     className="absolute bg-amber-950 ml-10 top-40 md:top-70 h-40 w-40 rounded-full border-5 border-white"
     alt="Foto de perfil"
    />
   </div>
  </>
 );
}
