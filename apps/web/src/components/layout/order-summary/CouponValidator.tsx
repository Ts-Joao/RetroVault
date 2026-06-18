"use client";

import { useState } from "react";
import { validateCoupon } from "@/lib/services/coupon.service";
import { useCheckoutStore } from "@/store/checkout.store";
import { useCartStore } from "@retrovault/store";


export default function CouponValidator() {
  const total = useCartStore((state) => state.total);
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const applyCoupon = useCheckoutStore(
    (state) => state.applyCoupon
  );

  const handleApplyCoupon = async () => {
    const code = inputCode.trim().toUpperCase();

    if (!code || isLoading) return;

    try {
      setIsLoading(true);

      const response = await validateCoupon(
        code,
        total
      );

      console.log("RESPONSE:", response);
      console.log("DISCOUNT:", response.data.data.discount);
      console.log("TYPE:", typeof response.data.data.discount);

      applyCoupon(
        response.data.data.coupon.code,
        response.data.data.discount
      );

      setInputCode("");
    } catch (error) {
      console.error(
        "Coupon validation failed",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1.5 font-chakra-petch">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
        Cupom de Desconto
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Insira seu cupom"
          value={inputCode}
          onChange={(e) =>
            setInputCode(e.target.value)
          }
          disabled={isLoading}
          className="flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:border-zinc-500 font-sans text-zinc-800 bg-zinc-50/50 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleApplyCoupon}
          disabled={
            isLoading ||
            !inputCode.trim()
          }
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Aplicando..."
            : "Aplicar"}
        </button>
      </div>
    </div>
  );
}