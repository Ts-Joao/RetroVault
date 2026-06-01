"use client";

import { FiEdit2 } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  price: number | string;
  rating?: number | string;
  maxInstallments?: number;
  photos?: { url: string }[];
  seller?: { name: string };
}

interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i) => (
        <FaStar key={`f${i}`} className="text-[#BF372A]" size={13} />
      ))}
      {half === 1 && <FaStarHalfAlt className="text-[#BF372A]" size={13} />}
      {Array(empty).fill(0).map((_, i) => (
        <FaRegStar key={`e${i}`} className="text-[#BF372A]" size={13} />
      ))}
    </div>
  );
}


export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const price = Number(product.price);
  const installments = product.maxInstallments && product.maxInstallments > 1
    ? product.maxInstallments
    : null;
  const installmentValue = installments
    ? (price / installments).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    : null;

    console.log(product.photos?.[0]?.url);

  return (
  <div className="w-[200px] flex-shrink-0 rounded-2xl overflow-hidden bg-white shadow-[0_4px_16px_rgba(0,0,0,0.13)] flex flex-col">

    {/* Imagem */}
    <div className="relative w-full h-[140px] bg-[#e0ddd5]">
      
      {product.photos?.[0]?.url ? (
        <img
          src={product.photos[0].url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-[#A6A39F]">
          Sem foto
        </div>
      )}

      {/* Botão editar (AGORA NO LUGAR CERTO) */}
      {onEdit && (
        <button
          onClick={() => onEdit(product.id)}
          title="Editar produto"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#F2EFDC] shadow flex items-center justify-center hover:bg-white transition-colors"
        >
          <FiEdit2 size={13} className="text-[#261F1A]" />
        </button>
      )}

    </div>

    {/* Conteúdo */}
    <div className="p-3 flex flex-col gap-1 flex-1">

      <p className="text-[13px] font-bold text-[#261F1A] leading-[1.4] line-clamp-2 m-0">
        {product.name}
      </p>

      {product.seller && (
        <p className="text-[11px] text-[#A6A39F] m-0">
          Por&nbsp;&nbsp;{product.seller.name}
        </p>
      )}

      <RatingStars rating={Number(product.rating ?? 0)} />

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-[16px] font-bold text-[#261F1A]">
          R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>

        {installments && (
          <span className="text-[11px] text-[#261F1A]">
            {installments}x R$ {installmentValue}
          </span>
        )}
      </div>

      <button className="mt-2 w-full bg-[#D9A13B] text-[#261F1A] rounded-lg px-3 py-2 text-[13px] font-bold flex items-center justify-between hover:brightness-95 transition-all">
        <span>Comprar agora</span>
      </button>

    </div>
  </div>
);}