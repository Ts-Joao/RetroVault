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

  const total =
    quantity * product.price

  const { units, cents } =
    splitPrice(total)

  const photoUrl =
    product.photos?.[0]?.url

  return (
    <div className="w-full rounded-lg bg-[#D9D9D9] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center">
          <div className="relative mr-4 h-24 w-24 rounded-md bg-white">
            {photoUrl ? (
              <Image
                src={photoUrl}
                fill
                sizes="96px"
                alt={product.name}
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                Sem imagem
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-lg">
            <span>Quantidade:</span>

            <button
              type="button"
              onClick={onDecrement}
              disabled={isUpdating}
              className="cursor-pointer text-2xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoIosRemoveCircleOutline />
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={onIncrement}
              disabled={isUpdating}
              className="cursor-pointer text-2xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoAddCircleOutline />
            </button>
          </div>

          <p className="mt-4 text-xl font-semibold">
            <span className="text-prim">
              R$
            </span>{' '}
            {units},
            <span className="text-third">
              {cents}
            </span>{' '}
            à vista
          </p>

          {isUpdating && (
            <p className="mt-2 text-sm text-gray-500">
              Atualizando...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}