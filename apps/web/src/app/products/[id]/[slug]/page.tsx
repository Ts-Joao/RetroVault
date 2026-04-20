
import PhotosProducts from "@/components/productsGeral/photosProducts"
import DescriptionProducts from "@/components/productsGeral/descriptionProducts"
import RecommentsProducts from "@/components/productsGeral/recommentsProducts"
import ReviewsProducts from "@/components/productsGeral/reviewsProducts"
import NavBar from "@/components/layout/nav-bar/NavBar"
import Footer from "@/components/layout/footer/Footer"

import { getProducts } from '@/services/product';


export default async function PageGeralproducts(){

    const products = await getProducts()
    
    
    return(
        <>
            <NavBar/>
          <div className="w-full flex gap-5 ">  
            <PhotosProducts/>
            <DescriptionProducts products = {products} />
         </div>   
            <RecommentsProducts product={products}/>
            <ReviewsProducts/>
            <Footer/>
        </>
    )
}