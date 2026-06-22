import ProductCard from "@/components/layout/product-grid/ProductCard";
import { getProductsBySellerId } from "@/lib/services/product.service";
import { User } from "@retrovault/core";
import { PiPackageBold } from "react-icons/pi";

type Props = {
  user: User;
};

export default async function SellerPage({ user }: Props) {
  const products = await getProductsBySellerId(user.id);

  return (
    <div className="p-6 md:p-8 bg-white rounded-b-2xl">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <PiPackageBold className="text-xl text-[#CD463A]" />
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800">Produtos no Vault</h2>
        </div>
        <span className="text-xs font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
          {products.length} itens cadastrados
        </span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-h-48">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-zinc-100 rounded-2xl">
          <p className="text-zinc-400 font-bold uppercase text-xs tracking-wider">Nenhum produto indexado neste inventário.</p>
        </div>
      )}
    </div>
  );
}