import { Product } from "@retrovault/shared";
import ProductCard from "./ProductCard";

type Props = {
 products: Product[];
};

export default function ProductGrid({ products }: Props) {
 return (
  <div className="grid grid-cols-3 justify-center p-3">
   {products.map((product) => (
    <ProductCard key={product.id} product={product} />
   ))}
  </div>
 );
}
