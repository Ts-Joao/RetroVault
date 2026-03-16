import Image from "next/image";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosRemoveCircleOutline } from "react-icons/io";

export default function ProductCart() {
  return (
    <>
      <div className="w-200 h-30 bg-[#D9D9D9] rounded-lg flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="relative h-25 w-25 bg-white rounded-sm mr-3">
            <Image
              src="/image/f1-25.webp"
              fill
              alt="Product Image"
              className="object-contain"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Formula rum</h3>
            <p className="text-sm text-gray-500">por: games midia</p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex text-xl">
            <p>Quantidade:</p>
            {/* Implementar lógica para adicionar e remover quantidade */}
            <button className="mx-3 cursor-pointer font-bold">
              <IoIosRemoveCircleOutline />
            </button>
            <span>1</span>
            <button className="mx-3 cursor-pointer">
              <IoAddCircleOutline />
            </button>
          </div>
          <p className="text-xl font-semibold mt-7">
            <span className="text-prim">R$ </span>19,
            <span className="text-third">99</span> à vista
          </p>
        </div>
      </div>
    </>
  );
}
