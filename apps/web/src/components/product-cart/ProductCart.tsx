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
  
  return (
    <>
      <div className="w-250 h-30 bg-[#D9D9D9] rounded-lg flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="relative h-25 w-25 bg-white rounded-sm mr-3">
            <Image
              src={product.photo}
              fill
              alt={product.name}
              className="object-contain"
            />
          </div>

          <div className="grid gap-5">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-md text-gray-500">Por: {product.seller}</p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex text-xl">
            <p>Quantidade:</p>
            {/* Implementar lógica para adicionar e remover quantidade */}
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
