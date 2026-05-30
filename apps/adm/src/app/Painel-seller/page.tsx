
'use client'

import { useState } from "react"

import PainelInicialSeller from "@/components/Painel-get/page"
import PainelEditSeller from "@/components/Painel-put-and-delete/page"
import PainelPostSeller from "@/components/Painel-post/page"

export default function Page(){

  const [abaAtual, setAbaAtual] = useState("painelinicial")



    return(

        <div>

            <nav className=" flex flex-col">
            {/* inicial */}
                <button onClick={()=>{setAbaAtual("painelinicial")}}>Geral</button>

            {/* Criar produto */}
                <button onClick={()=>{setAbaAtual("painelPostSeller")}}>Criar Produto</button>


            {/* Editar produto */}
                <button onClick={()=>{setAbaAtual("painelEditSeller")}}>Editar Produto</button>
            
            </nav>

            <main>


                {
                    abaAtual === "painelinicial" && <PainelInicialSeller/>
                }

                {
                    abaAtual === 'painelPostSeller' && <PainelPostSeller/>
                }

                {
                    abaAtual === 'painelEditSeller' && <PainelEditSeller/>
                }


            </main>

        </div>

    )
}