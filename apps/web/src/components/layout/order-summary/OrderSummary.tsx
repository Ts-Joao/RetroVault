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
  Installment,
  InstallmentProduct,
  Product,
} from "@retrovault/core";
import { useAuth } from "@/lib/context/auth.context";
import { useToast } from "@/components/ui/toast-provider";
import { checkoutOrder, PaymentMethod } from "@/lib/services/orders.client";
import { simulatePayment, confirmPayment } from "@/lib/services/payment.client";
import { useCartStore, useWalletStore } from "@retrovault/store";
import { useCheckoutStore } from "@/store/checkout.store";
import ShippingCalculator from "./ShippingCalculator";

export type PaymentValue = "pix" | "credit_card" | "debit_card" | "wallet";

type Props = {
  total: number;
  itens: CartItem[];
  checkoutMode?: "cart" | "single";
  product?: Product;
  seller?: { id: string; slug: string; name: string };
  buyerWallet?: { balance: string | number } | null;
  walletHistory?: unknown[];
  walletLoading?: boolean;
};

export default function Ordersummary({
  total,
  itens,
  buyerWallet,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { clearLocally } = useCartStore();
  const { clear: clearWallet } = useWalletStore();
  const { dynamicShippingCost, address } = useCheckoutStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentToken, setPaymentToken] = useState("");

  const cupom = 0;
  const finalPrice = total - cupom + dynamicShippingCost;

  const { isOpen, selected, toggle, selectOption } = useSelect<PaymentValue>();
  const {
    isOpen: isOpenInstallment,
    selected: installmentIndex,
    toggle: toggleInstallment,
    selectOption: selectInstallment,
  } = useSelect<number>();

  const installmentProducts: InstallmentProduct[] = itens.map((item) => ({
    price: item.product.price,
    quantity: item.amount,
    max_installments: item.product.max_installments,
    free_installments: item.product.free_installments,
    min_installment_amount: item.product.min_installment_amount,
    monthly_interest_rate: item.product.monthly_interest_rate,
  }));

  const installment: Installment[] = calculeCartInstallments(
    installmentProducts,
    finalPrice,
  );
  const selectedInstallment =
    installmentIndex != null ? installment[installmentIndex] : null;

  const paymentOptions = useMemo(
    () => [
      {
        value: "wallet" as PaymentValue,
        label: "Carteira Digital",
        sublabel: buyerWallet
          ? `Saldo: R$ ${Number(buyerWallet.balance).toFixed(2).replace(".", ",")}`
          : "Saldo indisponível",
        icon: <PiWalletBold />,
        iconClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      },
      {
        value: "pix" as PaymentValue,
        label: "PIX Instantâneo",
        sublabel: "Aprovação imediata na hora",
        icon: <PiPixLogoBold />,
        iconClass: "bg-teal-50 text-teal-700 border border-teal-100",
      },
      {
        value: "credit_card" as PaymentValue,
        label: "Cartão de Crédito",
        sublabel: "Visa, Mastercard, Elo",
        icon: <PiCreditCardBold />,
        iconClass: "bg-red-50 text-red-600 border border-red-100",
      },
      {
        value: "debit_card" as PaymentValue,
        label: "Cartão de Débito",
        sublabel: "Pagamento imediato da conta",
        icon: <PiCreditCardBold />,
        iconClass: "bg-blue-50 text-blue-700 border border-blue-100",
      },
    ],
    [buyerWallet],
  );

  const selectedOption = paymentOptions.find((p) => p.value === selected);

  async function handleCheckout() {
    if (!user?.sub) {
      toast.error("Faça login para continuar.");
      router.push("/login");
      return;
    }

    if (!address) {
      toast.error("Por favor, calcule e selecione o frete antes de finalizar.");
      return;
    }

    if (!selected) {
      toast.error("Selecione a forma de pagamento.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const paymentMethodMap: Record<PaymentValue, PaymentMethod> = {
        pix: "PIX",
        credit_card: "CREDIT_CARD",
        debit_card: "DEBIT_CARD",
        wallet: "WALLET",
      };

      const selectedMethod = selected as PaymentValue;
      const paymentMethod = paymentMethodMap[selectedMethod];

      const order = await checkoutOrder(
        user.sub,
        paymentMethod,
        selected === "credit_card" ? (installmentIndex ?? 0) + 1 : 1,
      );

      if (selected === "wallet") {
        toast.success("Pagamento aprovado pela carteira.");
        clearLocally();
        clearWallet();
        router.push(`/profile/${user.sub}/${user.slug}`);
        return;
      }

      const token = await simulatePayment(order.id, user.sub);
      setPaymentToken(token);
      toast.success("Pedido criado. Confirme o pagamento com o token gerado.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao finalizar checkout.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleConfirmPayment() {
    if (!paymentToken) {
      toast.error("Gere o token primeiro.");
      return;
    }

    setCheckoutLoading(true);
    try {
      await confirmPayment(paymentToken);
      toast.success("Pagamento confirmado com sucesso.");
      clearLocally();
      router.push(`/profile/${user?.sub}/${user?.slug}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao confirmar pagamento.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm font-chakra-petch">
      <h3 className="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">
        Resumo do Pedido
      </h3>

      {/* Frete — lê/escreve via checkout store */}
      <ShippingCalculator />

      {/* Cupom de Desconto */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Cupom de Desconto
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Insira seu cupom"
            className="flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:border-zinc-500 font-sans text-zinc-800 placeholder-zinc-400 bg-zinc-50/50"
          />
          <button
            type="button"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Valores Detalhados */}
      <div className="space-y-2.5 bg-zinc-50/70 rounded-xl border border-zinc-100 p-4 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal Produtos</span>
          <span className="font-semibold text-zinc-800">
            R$ {formatPrice(total)}
          </span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Custo de Frete</span>
          <span className="font-semibold text-emerald-600">
            + R$ {formatPrice(dynamicShippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Descontos Cupom</span>
          <span className="font-semibold text-red-500">
            - R$ {formatPrice(cupom)}
          </span>
        </div>

        <div className="pt-3 border-t border-dashed border-zinc-200 flex justify-between items-end">
          <span className="font-bold text-zinc-900 text-base">Total Geral</span>
          <div className="text-right">
            <span className="text-2xl font-black text-[#D33C2D]">
              R$ {formatPrice(finalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Seletor de Pagamento */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Forma de Pagamento
        </label>
        <div className="relative w-full">
          <button
            onClick={toggle}
            className={`w-full px-3 py-2.5 bg-white text-start flex items-center justify-between gap-2 border border-zinc-300 transition-all rounded-xl hover:border-zinc-400 cursor-pointer ${isOpen ? "ring-2 ring-zinc-500/10" : ""}`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg shrink-0 ${selectedOption?.iconClass ?? "bg-zinc-100 text-zinc-400 border border-zinc-200"}`}
              >
                {selectedOption?.icon ?? <PiCreditCardBold />}
              </div>
              <span
                className={`text-sm font-bold ${selected ? "text-zinc-800" : "text-zinc-400 font-medium"}`}
              >
                {selectedOption?.label ?? "Selecione a forma"}
              </span>
            </div>
            <IoIosArrowDown
              className={`text-zinc-400 transition-transform duration-200 text-base ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <ul className="absolute bottom-full mb-1 left-0 right-0 z-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg max-h-60 overflow-y-auto">
              {paymentOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => selectOption(opt.value)}
                  className={`flex cursor-pointer items-center gap-2.5 border-b border-zinc-50 px-3 py-2 transition-colors hover:bg-zinc-50 last:border-b-0 ${selected === opt.value ? "bg-amber-50/40" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg shrink-0 ${opt.iconClass}`}
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

        {/* Parcelas */}
        <div
          className={`grid transition-all duration-200 ${selected === "credit_card" ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"}`}
        >
          <div
            className={`${isOpenInstallment ? "overflow-visible" : "overflow-hidden"} min-h-0`}
          >
            <div className="relative w-full pt-1">
              <button
                onClick={toggleInstallment}
                className="w-full px-3 py-2 bg-zinc-50 text-start flex items-center justify-between gap-2 border border-zinc-200 rounded-xl hover:bg-zinc-100/70 transition"
              >
                <span className="text-xs font-bold text-zinc-700">
                  {selectedInstallment?.label ?? "Escolher parcelas"}
                </span>
                {selectedInstallment && (
                  <span className="text-[11px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded font-bold text-zinc-400">
                    {selectedInstallment.sublabel}
                  </span>
                )}
                <IoIosArrowDown
                  className={`text-zinc-400 transition-transform duration-200 ${isOpenInstallment ? "rotate-180" : ""}`}
                />
              </button>

              {isOpenInstallment && (
                <ul className="absolute bottom-full mb-1 left-0 right-0 z-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg text-xs font-semibold text-zinc-700">
                  {installment.map((inst, i) => (
                    <li
                      key={i}
                      onClick={() => selectInstallment(i)}
                      className={`flex cursor-pointer items-center justify-between border-b border-zinc-50 px-3 py-2 hover:bg-zinc-50 ${installmentIndex === i ? "bg-amber-50/40 text-zinc-900" : ""}`}
                    >
                      <p>{inst.label}</p>
                      <p className="text-[10px] text-zinc-400 font-bold">
                        {inst.sublabel}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botões Finais de Ação */}
      <div className="grid gap-2 pt-2 border-t border-zinc-100">
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="w-full rounded-xl bg-[#D9A128] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 tracking-wide uppercase disabled:opacity-50 cursor-pointer"
        >
          {checkoutLoading
            ? "Processando..."
            : selected === "wallet"
              ? "Pagar com carteira"
              : "Confirmar e Gerar Pagamento"}
        </button>

        {paymentToken && selected !== "wallet" && (
          <div className="mt-2 grid gap-2 rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 animate-fadeIn">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Token de validação simulado
            </p>
            <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 font-mono text-xs break-all text-center text-zinc-700 font-bold tracking-wider">
              {paymentToken}
            </div>
            <button
              onClick={handleConfirmPayment}
              disabled={checkoutLoading}
              className="w-full rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white uppercase tracking-wider hover:bg-zinc-800 transition disabled:opacity-50"
            >
              {checkoutLoading ? "Confirmando..." : "Confirmar liquidação"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}