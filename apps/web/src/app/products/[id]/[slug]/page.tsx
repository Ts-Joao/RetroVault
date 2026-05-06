
import DescriptionProductsGeral from "@/components/productsGeral/DescriptionProductsGeral"
import Reviews from "@/components/productsGeral/Review";
import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";
import { getProductById, getProducts } from '@/services/product'
import { getReview } from "@/services/review";


interface ProductsPageProps {
    params: Promise<{ id: string }>
}



export default async function ProductPage({ params }: ProductsPageProps) {
    const { id } = await params;
    const products = await getProducts()
    const product = await getProductById(id);

    if (!product) {
        return <div>Produto não encontrado</div>;
    }

    const productReviews = await getReview();
    const filteredReviews = productReviews.filter(
        (review) => review.productId === product.id
    );

    return (
        <>
            <NavBar/>
            <DescriptionProductsGeral product={product} key={product.id}/>
            <Reviews reviews={filteredReviews} />
            <Footer />
        </>
    )
}