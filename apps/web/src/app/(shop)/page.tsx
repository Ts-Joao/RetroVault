import CategoryBar from "@/components/layout/category/CategoryBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getProducts } from "@/lib/services/product.service";

export default async function Home() {
  const products = await getProducts()
  return (
    <>
      <div className="flex flex-col gap-10 mt-10">
        <CategoryBar />
        {
          products.length >= 1 ? (
            <ProductGrid products={products} />
          ) : (
            <span>Página de produto vazia</span>
          )
        }
      </div>
    </>
  );
}
