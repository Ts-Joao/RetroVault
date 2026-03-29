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
    text: "nfsdnfskndfnsdfnsdnfsdnf",
    titulo: "jurassic "
}

export default function PageGeralproducts(){
    

    
    return(
        <>
            <NavBar/>
          <div className="w-full flex gap-5 ">  
            <PhotosProducts imagens={imagens}/>
            <DescriptionProducts text={description.text} titulo={description.titulo}/>
         </div>   
            <RecommentsProducts/>
            <ReviewsProducts/>
            <Footer/>
        </>
    )
}