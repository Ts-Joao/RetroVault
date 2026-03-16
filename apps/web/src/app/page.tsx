import CategoryBar from "@/components/layout/category/CategoryBar";
import NavBar from "@/components/layout/nav-bar/NavBar";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import { getProducts } from "@/services/product";

import Shopping from "./shopping/Shopping";

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <NavBar />
      <Shopping />
    </>
  );
}
