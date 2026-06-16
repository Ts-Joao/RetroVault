"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/store/checkout.store";

export default function CouponValidator() {
  const [inputCode, setInputCode] = useState("");
  const applyCoupon = useCheckoutStore((state) => state.applyCoupon);

  function handleApply() {
    if (!inputCode.trim()) return;
    if (inputCode.toUpperCase() === "RETRO10") {
      applyCoupon(inputCode.toUpperCase(), 10);
    }
  }

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
          onChange={(e) => setInputCode(e.target.value)}
          className="flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:border-zinc-500 font-sans text-zinc-800 bg-zinc-50/50"
        />
        <button
          type="button"
          onClick={handleApply}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
