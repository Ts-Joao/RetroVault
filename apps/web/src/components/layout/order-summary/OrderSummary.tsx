"use client";

import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useSelect } from "@retrovault/shared";
import { PiPixLogoBold, PiCreditCardBold } from "react-icons/pi";
import { formatPrice } from "@retrovault/shared";

type PaymentValue = "pix" | "credit_card" | "debit_card";
type InstallmentValue = "1x" | "2x" | "3x" | "6x" | "12x";

type Props = {
  total: number
  shippingCost: number
}

export default function Ordersummary({total, shippingCost}: Props) {

 const cupom = 0
 const finalPrice = total - cupom + shippingCost

 const { isOpen, selected, toggle, selectOption } = useSelect<PaymentValue>();
 
 const {
  isOpen: isOpenInstallment,
  selected: installment,
  toggle: toggleInstallment,
  selectOption: selectInstallment,
 } = useSelect<InstallmentValue>();

 const paymentOptions = [
  {
   value: "pix" as PaymentValue,
   label: "PIX",
   sublabel: "Transferência instantânea",
   icon: <PiPixLogoBold />,
   iconClass: "bg-teal-50 text-teal-700",
  },
  {
   value: "credit_card" as PaymentValue,
   label: "Cartão de Crédito",
   sublabel: "Visa, Mastercard, Elo",
   icon: <PiCreditCardBold />,
   iconClass: "bg-red-50 text-prim",
  },
  {
   value: "debit_card" as PaymentValue,
   label: "Cartão de Débito",
   sublabel: "Pagamento imediato",
   icon: <PiCreditCardBold />,
   iconClass: "bg-blue-50 text-blue-700",
  },
 ];

 const installmentOptions = [
  {
   value: "1x" as InstallmentValue,
   label: "1x",
   sublabel: `R$ ${formatPrice(finalPrice)} sem juros`,
  },
  {
   value: "2x" as InstallmentValue,
   label: "2x",
   sublabel: `R$ ${formatPrice(finalPrice / 2)} sem juros`,
  },
  {
   value: "3x" as InstallmentValue,
   label: "3x",
   sublabel: `R$ ${formatPrice(finalPrice / 3)} sem juros`,
  },
  {
   value: "6x" as InstallmentValue,
   label: "6x",
   sublabel: `R$ ${formatPrice(finalPrice / 6)} sem juros`,
  },
  {
   value: "12x" as InstallmentValue,
   label: "12x",
   sublabel: `R$ ${formatPrice(finalPrice / 12)} com juros`,
  },
 ];

 const selectedInstallment = installmentOptions.find(
  (p) => p.value === installment,
 );

 const selectedOption = paymentOptions.find((p) => p.value === selected);

 return (
  <div className="flex flex-col gap-10 justify-center">
   <div className="grid bg-[#d9d9d9] px-3 py-2 rounded-lg gap-2">
    <h1>Cupom:</h1>
    <div className="grid gap-1">
     <input
      type="text"
      placeholder="Insira o Cupom"
      className="flex bg-white w-full justify-self-center rounded-lg py-1 px-2 focus:outline-none"
     />
     <input
      type="button"
      value="Aplicar Cupom"
      className="w-full bg-submit py-0.5 rounded-md text-sm cursor-pointer"
     />
    </div>
   </div>
   <div className="bg-[#d9d9d9] px-3 py-2 rounded-lg flex flex-col justify-between h-35">
    <div className="grid gap-0.5">
     <p className="flex justify-between">
      Produto:{" "}
      <span className="text-[#168634]">
       + R$ {formatPrice(total)}
      </span>
     </p>
     <p className="flex justify-between">
      Frete: <span className="text-[#168634]">+ R$ {formatPrice(shippingCost)}</span>
     </p>
     <p className="flex justify-between">
      Cupom: <span className="text-prim">- R$ {formatPrice(cupom)}</span>
     </p>
    </div>
    <h1 className="flex justify-between text-xl">
     Total <span>R$ {formatPrice(finalPrice)}</span>
    </h1>
   </div>
   <div className="bg-[#d9d9d9] px-3 py-2 rounded-lg">
  <h1>Forma de pagamento</h1>
    <div className="relative w-full">
      <button
        onClick={toggle}
        className={`
          w-full px-2 py-1.5 bg-white text-start flex items-center justify-between gap-2
          border border-gray-200 transition-all duration-150 cursor-pointer
          hover:border-gray-300 hover:bg-amber-50
          ${isOpen ? "rounded-b-lg border-t-0" : "rounded-lg"}
        `}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center text-base shrink-0 ${selectedOption?.iconClass ?? "bg-gray-100 text-gray-400"}`}
          >
            {selectedOption?.icon ?? <PiCreditCardBold />}
          </div>
          <span
            className={`text-sm font-medium ${selected ? "text-gray-900" : "text-gray-400"}`}
          >
            {selectedOption?.label ?? "Selecione"}
          </span>
        </div>
        <IoIosArrowDown
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute bottom-full left-0 right-0 bg-white border border-gray-300 border-b-0 rounded-t-xl overflow-hidden z-10">
          {paymentOptions
            .filter((p) => p.value !== selected)
            .map((opt) => (
              <li
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-amber-50 border-b border-gray-100 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-base shrink-0 ${opt.iconClass}`}
                >
                  {opt.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.sublabel}</p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>

    <div className={`grid transition-all duration-200 ${selected === 'credit_card' ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
      <div className={`min-h-0 ${isOpenInstallment ? 'overflow-visible' : 'overflow-hidden'}`}>
        <div className="relative w-full">
          <button
            onClick={toggleInstallment}
            className={`
              w-full px-2 py-1.5 bg-white text-start flex items-center justify-between gap-2
              border border-gray-200 transition-all duration-150 cursor-pointer
              hover:border-gray-300 hover:bg-amber-50
              ${isOpenInstallment ? "rounded-b-lg border-t-0" : "rounded-lg"}
            `}
          >
            <span className={`text-sm font-medium ${installment ? "text-gray-900" : "text-gray-400"}`}>
              {selectedInstallment?.label ?? "Selecione as parcelas"}
            </span>
            {selectedInstallment && (
              <span className="text-xs text-gray-400">
                {selectedInstallment.sublabel}
              </span>
            )}
            <IoIosArrowDown
              className={`transition-transform duration-200 ${isOpenInstallment ? "rotate-180" : ""}`}
            />
          </button>

          {isOpenInstallment && (
            <ul className="absolute bottom-full left-0 right-0 bg-white border border-gray-300 border-b-0 rounded-t-xl overflow-hidden z-10 text-sm">
              {installmentOptions
                .filter((p) => p.value !== installment)
                .map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => selectInstallment(opt.value)}
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-amber-50 border-b border-gray-100 transition-colors"
                  >
                    <p>{opt.label}</p>
                    <p>{opt.sublabel}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
   <Link href="/" className="bg-submit text-center text-xl rounded-lg">
    <button className="cursor-pointer px-20 py-2">Continuar Comprar</button>
   </Link>
  </div>
 );
}
