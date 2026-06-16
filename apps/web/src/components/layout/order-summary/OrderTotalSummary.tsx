"use client";

import { formatPrice } from "@retrovault/core";
import { useCartStore } from "@retrovault/store";
import { useCheckoutStore } from "@/store/checkout.store";

export default function OrderTotalSummary() {
  const total = useCartStore((state) => state.total);
  const { dynamicShippingCost, couponDiscount } = useCheckoutStore();

  const finalPrice = total - couponDiscount + dynamicShippingCost;

  return (
    <div className="space-y-2.5 bg-zinc-50/70 rounded-xl border border-zinc-100 p-4 text-sm font-chakra-petch">
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
      {couponDiscount > 0 && (
        <div className="flex justify-between text-zinc-600">
          <span>Descontos Cupom</span>
          <span className="font-semibold text-red-500">
            - R$ {formatPrice(couponDiscount)}
          </span>
        </div>
      )}
      <div className="pt-3 border-t border-dashed border-zinc-200 flex justify-between items-end">
        <span className="font-bold text-zinc-900 text-base">Total Geral</span>
        <span className="text-2xl font-black text-[#D33C2D]">
          R$ {formatPrice(finalPrice)}
        </span>
      </div>
    </div>
  );
}
