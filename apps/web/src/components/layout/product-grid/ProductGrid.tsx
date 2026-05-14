import { Product, User } from "../../../../../../packages/core";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  users: User[];
};

export default function ProductGrid({ products, users }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 justify-center mb-5 ">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} users={users} />
      ))}
    </div>
  );
}