"use client";

import Image from "next/image";

export default function Profile() {
 return (
  <>
   <div className="bg-amber-950 flex flex-col my-20 mx-50 border-2 border-[#BF372A]">
    <Image
     src="/image/placeholder-pfp.webp"
     width={100}
     height={100}
     className="w-full max-h-50"
     alt="Banner do perfil"
    />

    <div className="bg-[#EEEEEE] py-2">
     <div className="ml-40 mb-20">
      <h1 className="text-2xl font-bold">Blue ray 4ever</h1>
      <h2 className="text-md font-medium">total de vendas: 13</h2>
     </div>
     <div className="mt-10 mb-3 grid grid-cols-2 px-50 text-2xl font-semibold">
        <button className="underline">Produtos</button>
        <button className="underline">Avaliações</button>
     </div>
    </div>
    <div className="bg-[#E3E2E2] grid grid-cols-4 justify-items-center p-10">
     <div className="flex bg-amber-200 h-20 w-20">a</div>
     <div className="flex bg-amber-200 h-20 w-20">a</div>
     <div className="flex bg-amber-200 h-20 w-20">a</div>
     <div className="flex bg-amber-200 h-20 w-20">a</div>
    </div>
    <Image
     src="/image/placeholder-pfp.webp"
     width={50}
     height={50}
     className="absolute bg-amber-950 ml-10 top-85 h-25 w-25 rounded-full border-5 border-white"
     alt="Foto de perfil"
    />
   </div>
  </>
 );
}
