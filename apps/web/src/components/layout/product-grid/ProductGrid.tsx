import { Product } from "../../../../../../packages/core";
import ProductCard from "./ProductCard";
import Link from "next/link";

type Props = {
 products: Product[];
};



export default function ProductGrid({ products }: Props) {
 return (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 justify-center">
   {products.map((product) => (
    <Link href={`/products/${product.id}/${product.name}`} className="justify-self-center" key={product.id}>
     <ProductCard key={product.id} product={product} />
    </Link>
   ))}
  </div>
 );
}
