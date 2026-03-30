'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import PhotosProducts from "@/components/productsGeral/photosProducts"
import DescriptionProducts from "@/components/productsGeral/descriptionProducts"
import RecommentsProducts from "@/components/productsGeral/recommentsProducts"
import ReviewsProducts from "@/components/productsGeral/reviewsProducts"
import NavBar from "@/components/layout/nav-bar/NavBar"
import Footer from "@/components/layout/footer/Footer"

import capajura from '@/../public/image/capajura.png'
import contracapa from '@/../public/image/contracapajura.png'
import frame from '@/../public/image/frame.png'

const imagens = [
    capajura, contracapa, frame
]

const description = {
    titulo: "Jurassic Park ",
    ano: '1998',
    tipo: 'DVD',
    genero: 'Ação, Sci-fi',
    situacao: 'Usado',
    description: 'Os paleontólogos Alan Grant, Ellie Sattler e o matemático Ian Malcolm fazem parte de um seleto grupo escolhido para visitar uma ilha habitada por dinossauros criados a partir de DNA pré-histórico. O idealizador do projeto e bilionário John Hammond garante a todos que a instalação é completamente segura. Mas após uma queda de energia, os visitantes descobrem, aos poucos, que vários predadores ferozes estão soltos e à caça.',
    preco: 150,
    descont: false,
    numparcelas: 3,
    parcelas: 35
}

const recomments = {
    imgcapa: capajura,
    price: 150,
    title: "Jurassic Park",
    numparcelas: 3,
    parcelas: 35
}


export default async function PageGeralproducts(){
    
    
    return(
        <>
            <NavBar/>
          <div className="w-full flex gap-5 ">  
            <PhotosProducts imagens={imagens}/>
            <DescriptionProducts titulo={description.titulo} ano={description.ano} tipo={description.tipo} genero={description.genero} situacao={description.situacao} description={description.description} numparcelas={description.numparcelas} parcelas={description.parcelas} preco={description.preco}/>
         </div>   
            <RecommentsProducts title={recomments.title} imgcapa={recomments.imgcapa} price={recomments.price} numparcelas={recomments.numparcelas} parcelas={recomments.parcelas}/>
            <ReviewsProducts/>
            <Footer/>
        </>
    )
}