'use client'

import Image from 'next/image'
import { IoAddCircleOutline } from 'react-icons/io5'
import { IoIosRemoveCircleOutline } from 'react-icons/io'

import {
  Product,
  splitPrice,
} from '@retrovault/core'

type Props = {
  product?: Product | null
  quantity: number
  isUpdating?: boolean
  onIncrement: () => void
  onDecrement: () => void
}

export default function ProductCart({
  product,
  quantity,
  isUpdating = false,
  onIncrement,
  onDecrement,
}: Props) {
  if (!product) return null

  const total = quantity * product.price
  const { units, cents } = splitPrice(total)
  const photoUrl = `${process.env.NEXT_PUBLIC_API_URL}${product.photos[0]?.url}`

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Detalhes do Produto */}
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 rounded-xl bg-zinc-50 border border-zinc-100 p-1 flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <Image
                src={photoUrl}
                fill
                sizes="80px"
                alt={product.name}
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400 font-medium">
                Sem imagem
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Item do carrinho</span>
            <h3 className="text-base md:text-lg font-bold text-zinc-800 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Quantidade e Preços */}
        <div className="flex flex-col sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t border-dashed border-zinc-100 sm:border-t-0">
          
          {/* Seletor de Quantidade */}
          <div className="flex items-center gap-2.5 text-sm font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200/60 rounded-xl px-3 py-1.5 w-fit">
            <span className="text-zinc-400 font-medium text-xs mr-1">Qtd:</span>

            <button
              type="button"
              onClick={onDecrement}
              disabled={isUpdating}
              className="text-zinc-500 hover:text-zinc-800 transition text-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <IoIosRemoveCircleOutline />
            </button>

            <span className="w-4 text-center font-bold text-zinc-900">{quantity}</span>

            <button
              type="button"
              onClick={onIncrement}
              disabled={isUpdating}
              className="text-zinc-500 hover:text-zinc-800 transition text-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <IoAddCircleOutline />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-left sm:text-right mt-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400 block leading-none">Subtotal item</span>
            <p className="text-lg font-black text-zinc-900 mt-0.5">
              <span className="text-[#D33C2D] font-bold text-xs mr-0.5">R$</span> 
              {units},<span className="text-xs font-bold text-zinc-700">{cents}</span>
              <span className="text-[10px] text-zinc-400 font-medium ml-1">à vista</span>
            </p>
          </div>

          {isUpdating && (
            <p className="text-[10px] text-amber-600 font-medium animate-pulse">
              Atualizando valores...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}