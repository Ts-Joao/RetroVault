import CategoryBar from "@/components/layout/category/CategoryBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getProducts } from "@/services/product";

export default async function Home() {
  const products = await getProducts()
  return (
    <>
      <section className="p-6">
        <CategoryBar />
      </section>
      <section className="justify-center">
        <ProductGrid products={products} />
      </section>
    </>
  );
}
