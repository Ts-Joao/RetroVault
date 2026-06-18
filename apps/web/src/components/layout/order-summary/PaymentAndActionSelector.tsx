"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { useSelect } from "@retrovault/ui-hooks";
import { PiPixLogoBold, PiCreditCardBold, PiWalletBold } from "react-icons/pi";
import {
  calculeCartInstallments,
  CartItem,
  formatPrice,
  InstallmentProduct,
} from "@retrovault/core";
import { useAuth } from "@/lib/context/auth.context";
import { useToast } from "@/components/ui/toast-provider";
import { useCheckoutStore, PaymentValue } from "@/store/checkout.store";
import { checkoutOrder, PaymentMethod } from "@/lib/services/orders.client";
import { simulatePayment, confirmPayment } from "@/lib/services/payment.client";
import { useCartStore, useWalletStore } from "@retrovault/store";

type Props = { itens: CartItem[] };

export default function PaymentAndActionSelector({ itens }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const total = useCartStore((state) => state.total);
  const { clearLocally } = useCartStore();
  const { wallet, clear: clearWallet } = useWalletStore();

  const {
    address,
    dynamicShippingCost,
    couponDiscount,
    selectedPayment,
    installmentIndex,
    paymentToken,
    setPayment,
    setInstallment,
    setPaymentToken,
  } = useCheckoutStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const finalPrice = total - couponDiscount + dynamicShippingCost;

  const { isOpen, toggle, selectOption } = useSelect<PaymentValue>();
  const {
    isOpen: isOpenInst,
    toggle: toggleInst,
    selectOption: selectInst,
  } = useSelect<number>();

  const safeItens = itens || [];

  const installmentProducts: InstallmentProduct[] = safeItens.map((item) => ({
    price: item.product.price,
    quantity: item.amount,
    max_installments: item.product.max_installments,
    free_installments: item.product.free_installments,
    min_installment_amount: item.product.min_installment_amount,
    monthly_interest_rate: item.product.monthly_interest_rate,
  }));

  const installmentOptions = calculeCartInstallments(
    installmentProducts,
    finalPrice,
  );
  const selectedInstallment =
    installmentIndex != null ? installmentOptions[installmentIndex] : null;

  const paymentOptions = useMemo(
    () => [
      {
        value: "wallet" as PaymentValue,
        label: "Carteira Digital",
        sublabel: wallet
          ? `Saldo: R$ ${Number(wallet.balance).toFixed(2).replace(".", ",")}`
          : "Saldo indisponível",
        icon: <PiWalletBold />,
        iconClass: "bg-yellow-50 text-yellow-600",
      },
      {
        value: "pix" as PaymentValue,
        label: "PIX Instantâneo",
        sublabel: "Aprovação imediata na hora",
        icon: <PiPixLogoBold />,
        iconClass: "bg-teal-50 text-teal-700",
      },
      {
        value: "credit_card" as PaymentValue,
        label: "Cartão de Crédito",
        sublabel: "Visa, Mastercard, Elo",
        icon: <PiCreditCardBold />,
        iconClass: "bg-red-50 text-red-600",
      },
      {
        value: "debit_card" as PaymentValue,
        label: "Cartão de Débito",
        sublabel: "Visa, Mastercard, Elo",
        icon: <PiCreditCardBold />,
        iconClass: "bg-blue-50 text-blue-600",
      },
    ],
    [wallet],
  );

  const selectedOption = paymentOptions.find(
    (p) => p.value === selectedPayment,
  );

  async function handleCheckout() {
    if (!user?.sub)
      return (toast.error("Faça login para continuar."), router.push("/login"));

    if (safeItens.length === 0)
      return toast.error("Nenhum produto selecionado para a compra.");

    if (!address)
      return toast.error("Calcule o CEP e selecione uma opção de frete.");

    if (!selectedPayment) return toast.error("Selecione a forma de pagamento.");

    setCheckoutLoading(true);
    try {
      const paymentMethodMap: Record<PaymentValue, PaymentMethod> = {
        pix: "PIX",
        credit_card: "CREDIT_CARD",
        debit_card: "DEBIT_CARD",
        wallet: "WALLET",
      };

      const order = await checkoutOrder(
        user.sub,
        address,
        paymentMethodMap[selectedPayment],
        selectedPayment === "credit_card" ? (installmentIndex ?? 0) + 1 : 1,
        safeItens
      );

      if (selectedPayment === "wallet") {
        toast.success("Pagamento aprovado com saldo.");
        clearLocally();
        clearWallet();
        router.push(`/profile/${user.sub}/${user.slug}`);
        return;
      }

      // Gera o token de simulação da API
      const token = await simulatePayment(order.id, user.sub);
      setPaymentToken(token);
      
      toast.success("Pedido criado! Redirecionando para o pagamento...");
      
      router.push(`/checkout/payment/${order.id}?method=${selectedPayment}`);

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro no checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="space-y-4 font-chakra-petch">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Forma de Pagamento
        </label>
        <div className="relative w-full">
          <button
            onClick={toggle}
            className="w-full px-3 py-2.5 bg-white text-start flex items-center justify-between border border-zinc-300 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg shrink-0 ${selectedOption?.iconClass ?? "bg-zinc-100"}`}
              >
                {selectedOption?.icon ?? <PiCreditCardBold />}
              </div>
              <span
                className={`text-sm font-bold ${selectedPayment ? "text-zinc-800" : "text-zinc-400 font-medium"}`}
              >
                {selectedOption?.label ?? "Selecione a forma"}
              </span>
            </div>
            <IoIosArrowDown
              className={`text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isOpen && (
            <ul className="absolute bottom-full mb-1 left-0 right-0 z-20 rounded-xl border bg-white shadow-lg max-h-60 overflow-y-auto">
              {paymentOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    selectOption(opt.value);
                    setPayment(opt.value);
                  }}
                  className={`flex cursor-pointer items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 ${selectedPayment === opt.value ? "bg-amber-50/40" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg ${opt.iconClass}`}
                  >
                    {opt.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      {opt.sublabel}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedPayment === "credit_card" && (
          <div className="relative w-full pt-1">
            <button
              onClick={toggleInst}
              className="w-full px-3 py-2 bg-zinc-50 text-start flex items-center justify-between border border-zinc-200 rounded-xl"
            >
              <span className="text-xs font-bold text-zinc-700">
                {selectedInstallment?.label ?? "Escolher parcelas"}
              </span>
              <IoIosArrowDown
                className={`text-zinc-400 transition-transform ${isOpenInst ? "rotate-180" : ""}`}
              />
            </button>
            {isOpenInst && (
              <ul className="absolute bottom-full mb-1 left-0 right-0 z-20 rounded-xl border bg-white shadow-lg text-xs font-semibold text-zinc-700">
                {installmentOptions.map((inst, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      selectInst(i);
                      setInstallment(i);
                    }}
                    className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-zinc-50 ${installmentIndex === i ? "bg-amber-50/40" : ""}`}
                  >
                    <p>{inst.label}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-2 pt-2 border-t border-zinc-100">
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="w-full rounded-xl bg-[#D9A128] py-3.5 text-sm font-bold text-white uppercase tracking-wide disabled:opacity-50 transition hover:brightness-95 cursor-pointer"
        >
          {checkoutLoading
            ? "Processando..."
            : selectedPayment === "wallet"
              ? "Pagar com carteira"
              : "Confirmar e Gerar Pagamento"}
        </button>
      </div>
    </div>
  );
}
