import CategoryBar from "@/components/layout/category/CategoryBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getProducts } from "@/services/product";

export default async function Home() {
  const products = await getProducts()
  return (
    <>
      <div className="flex flex-col gap-10 mt-10">
          <CategoryBar />
          <ProductGrid products={products} />
      </div>
    </>
  );
}
