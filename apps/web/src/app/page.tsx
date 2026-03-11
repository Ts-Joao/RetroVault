import NavBar from "@/components/layout/nav-bar/NavBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getProducts } from "@/services/product";

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <NavBar />
      <section className="justify-center">
        <ProductGrid products={products} />
      </section>
    </>
  );
}
