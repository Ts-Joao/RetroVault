'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import PhotosProducts from "@/components/productsGeral/photosProducts"
import DescriptionProducts from "@/components/productsGeral/descriptionProducts"
import RecommentsProducts from "@/components/productsGeral/recommentsProducts"
import ReviewsProducts from "@/components/productsGeral/reviewsProducts"


export default function PageGeralproducts(){
    

    
    return(
        <>
            <PhotosProducts/>
            <DescriptionProducts/>
            <RecommentsProducts/>
            <ReviewsProducts/>
        </>
    )
}