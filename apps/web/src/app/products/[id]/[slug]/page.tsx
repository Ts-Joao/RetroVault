
import PhotosProducts from "@/components/productsGeral/photosProducts"
import DescriptionProducts from "@/components/productsGeral/descriptionProducts"
import RecommentsProducts from "@/components/productsGeral/recommentsProducts"
import ReviewsProducts from "@/components/productsGeral/reviewsProducts"
import NavBar from "@/components/layout/nav-bar/NavBar"
import Footer from "@/components/layout/footer/Footer"

import { getProducts, getProductById } from '@/services/product';
import { Product } from "@retrovault/core"

interface ProductsProps {
    params: Promise<{ id: string }>
}



export default async function PageGeralproducts({params}: ProductsProps){

        const { id } = await params
        const products = await getProducts()
        const product = await getProductById(id)
    
    
    return(
        <>
            <NavBar/>
          <div className="w-full flex gap-5 ">  

            <DescriptionProducts key={product.id} product={product} />
         </div>   

            <ReviewsProducts/>
            <Footer/>
        </>
    )
}