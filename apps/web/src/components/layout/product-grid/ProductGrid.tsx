import { Product } from "@retrovault/core";
import ProductCard from "./ProductCard";

type Props = {
 products: Product[];
};

export default function ProductGrid({ products }: Props) {
 return (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center p-3">
   {products.map((product) => (
    <ProductCard key={product.id} product={product} />
   ))}
  </div>
 );
}
