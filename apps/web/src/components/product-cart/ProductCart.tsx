import Link from "next/link";
import Image from "next/image";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Product, splitPrice } from "@retrovault/core";

type Props = {
  product: Product
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export default function ProductCart({ product, quantity, onIncrement, onDecrement }: Props) {
  const total = quantity * product.price
  const { units, cents } = splitPrice(total)
  const photoUrl = product.photos?.[0]?.url

  return (
    <>
      <div className="w-250 h-30 bg-[#D9D9D9] rounded-lg flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="relative h-25 w-25 bg-white rounded-sm mr-3">
            {photoUrl && (
              <Image
                src={photoUrl}
                fill
                alt={product.name}
                className="object-contain"
              />
            )}
          </div>

          <div className="grid gap-5">
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </div>
        </div>

        <div className="text-center">
          <div className="flex text-xl">
            <p>Quantidade:</p>
            <button className="mx-3 cursor-pointer font-bold" onClick={onDecrement}>
              <IoIosRemoveCircleOutline />
            </button>
            <span>{quantity}</span>
            <button className="mx-3 cursor-pointer" onClick={onIncrement}>
              <IoAddCircleOutline />
            </button>
          </div>
          <p className="text-xl font-semibold mt-7">
            <span className="text-prim">R$ </span>{units},
            <span className="text-third">{cents}</span> à vista
          </p>
        </div>
      </div>
    </>
  );
}
