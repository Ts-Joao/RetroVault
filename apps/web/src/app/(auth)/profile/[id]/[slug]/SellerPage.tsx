import ProductCard from "@/components/layout/product-grid/ProductCard"
import { getProductsBySellerId } from "@/lib/services/product.service"
import { User } from "@retrovault/core"

type Props = {
  user: User
}

export default async function SellerPage({ user }: Props) {
  const products = await getProductsBySellerId(user.id)

  return (
    <div>
      <div className="bg-bg border-t border-white/10 flex">
        <p className="text-black">Produtos a venda</p>
      </div>

      {products.length > 0 ?
        (<div className="bg-bg rounded-b-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 min-h-48">
          {/* Placeholders de produto — substituir por componente real */}
          {getProductsBySellerId(user.id).then((products) => products.map((p) => <ProductCard key={p.id} product={p} />))}
        </div>)
        : <p className="bg-bg rounded-b-2xl p-6 md:p-8 lg:py-24 text-black text-center">Nenhum produto a venda</p>
      }
    </div>
  )
}