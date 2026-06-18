"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PiBag } from "react-icons/pi";
import StarRating from "@/components/StarRating";
import {
  Product,
  calculeCartInstallments,
  formatPrice,
  splitPrice,
} from "@retrovault/core";
import ButtonFavorites from "@/components/Favoritos/ButtonFavorites";
import { User } from "@retrovault/core";
import { addCartItem } from "@/lib/services/cart.service";
import { useToast } from "@/components/ui/toast-provider";

type Props = {
  product: Product;
  users?: User[];
};

export default function ProductCard({ product, users }: Props) {
  const router = useRouter();
  const seller = users?.find((u) => u.id === product.sellerId);
  const toast = useToast()

  const firstPhoto = product.photos?.[0]?.url || "";
  const imageUrl = firstPhoto.startsWith("/uploads")
    ? `${process.env.NEXT_PUBLIC_API_URL}${firstPhoto}`
    : firstPhoto;

  const installments = calculeCartInstallments([
    {
      price: product.price,
      quantity: 1,
      max_installments: product.max_installments,
      free_installments: product.free_installments,
      min_installment_amount: product.min_installment_amount,
      monthly_interest_rate: product.monthly_interest_rate,
    },
  ]);

  const best = installments.at(-1) ?? {
    installment_amount: product.price,
    installments: 1,
  };

  const { units, cents } = splitPrice(best.installment_amount);
  const productLink = `/products/${product.id}/${product.name}`;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-sm transition-all duration-300 hover:shadow-md max-w-[185px] min-w-[185px] md:max-w-[220px] md:min-w-[220px] font-chakra-petch text-zinc-900">
      
      <div>
        <div className="relative flex items-center justify-center bg-zinc-50 rounded-xl border border-zinc-100 p-1.5 h-28 w-full overflow-hidden md:h-36">
          <div className="absolute right-1.5 top-1.5 z-10">
            <ButtonFavorites productId={product.id} />
          </div>

          <Link href={productLink} className="relative w-full h-full block">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 140px, 190px"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 font-medium">
                Sem Foto
              </div>
            )}
          </Link>
        </div>

        <div className="mt-2 px-0.5">
          <h2
            onClick={() => router.push(productLink)}
            className="font-barlow-condensed text-base md:text-xl font-bold leading-tight cursor-pointer line-clamp-2 min-h-[2.5rem] text-zinc-800 group-hover:text-zinc-950"
          >
            {product.name}
          </h2>

          {/* Vendedor */}
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Por{" "}
            <Link
              href={`/profile/${seller?.id}/${seller?.slug}`}
              className="font-semibold text-zinc-500 hover:text-zinc-700 underline decoration-zinc-300"
            >
              {seller?.name || "Vendedor"}
            </Link>
          </p>

          <div className="mt-1 flex items-center justify-start pointer-events-none transform scale-75 origin-left">
            <StarRating rating={product.rating} />
          </div>
          <Link href={productLink} className="block mt-1.5">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold block leading-none">À vista</span>
            
            <p className="font-black text-xl md:text-2xl text-zinc-900 leading-none mt-0.5">
              <span className="text-[#D33C2D] text-sm md:text-base font-bold mr-0.5">R$</span>
              {formatPrice(product.price)}
            </p>

            {/* Parcelamento */}
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
              <span className="bg-zinc-100 text-zinc-700 px-1 py-0.2 rounded text-[9px] font-bold">
                {product.max_installments}x
              </span>
              <p>
                de R$ {units},{cents}
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center gap-1.5">
        <Link
          href={`/checkout/${product.id}`}
          className="flex-1 bg-[#D9A128] text-white font-bold rounded-xl py-1.5 text-center text-xs uppercase tracking-wider shadow-sm transition hover:brightness-95"
        >
          Comprar
        </Link>
        
        <button
          onClick={async () => {
            const cart = await addCartItem(product.id, 1) 
            if(cart) {
              toast.success("Produto adicionado à sacola!")
            } else {
              toast.error("Erro ao adicionar produto à sacola!")
            }
          }}
          className="bg-zinc-900 text-white p-1.5 rounded-xl transition hover:bg-zinc-800 flex items-center justify-center shadow-sm cursor-pointer"
          title="Adicionar à Sacola"
        >
          <PiBag className="text-base" />
        </button>
      </div>

    </div>
  );
}