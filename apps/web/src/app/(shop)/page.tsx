import CategoryBar from "@/components/layout/category/CategoryBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getProducts } from "@/lib/services/product.service";
import { getUsers } from "@/lib/services/user.server";

export default async function Home() {
  const products = await getProducts()
  const user = await getUsers()

  return (
    <div className="flex flex-col gap-10 mt-10">
      <CategoryBar />
      <div className="flex flex-col items-center justify-center">
        {products.length ? (
          <ProductGrid products={products} users={user} />
        ) : (
          <span className="text-center">Nenhum produto disponível</span>
        )}
      </div>
    </div>
  );
}
