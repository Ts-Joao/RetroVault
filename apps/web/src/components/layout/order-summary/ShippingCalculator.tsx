"use client";

import { useState } from "react";
import { formatPrice } from "@retrovault/core";
import { useShippingStore } from "@/store/shipping.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { useToast } from "@/components/ui/toast-provider";

function formatCep(value: string) {
  return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9);
}

export default function ShippingCalculator() {
  const [cep, setCep] = useState("");
  const [isCalculado, setIsCalculado] = useState(false);
  const [isModalFreteOpen, setIsModalFreteOpen] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState<number | null>(null);

  const { shipping, calculate, shippingLoading } = useShippingStore();
  const setShippingData = useCheckoutStore((state) => state.setShippingData);
  const toast = useToast();

  async function handleCalcularCep() {
    if (cep.length < 8) return;
    try {
      await calculate(cep);
      setIsCalculado(true);
      setIsModalFreteOpen(true);
    } catch (error) {
      toast.error("Erro ao calcular frete");
    }
  }

  function handleSelectOption(price: number) {
    setFreteSelecionado(price);
    const logradouroCompleto = shipping 
      ? `${shipping.logradouro}, ${shipping.neighborhood || ""} - ${shipping.city}/${shipping.state}`
      : "";
    setShippingData(price, logradouroCompleto);
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">CEP de Entrega</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={formatCep(cep)}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
          maxLength={9}
          placeholder="00000-000"
          disabled={shippingLoading}
          className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 text-zinc-800 bg-zinc-50/50 font-sans"
        />
        <button
          type="button"
          onClick={handleCalcularCep}
          disabled={shippingLoading || cep.length < 8}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-zinc-800 transition cursor-pointer disabled:opacity-40 font-chakra-petch"
        >
          {shippingLoading ? "Buscando..." : "Calcular"}
        </button>
      </div>

      {shipping && isCalculado && (
        <div className="mt-2 p-3.5 bg-zinc-50/80 rounded-xl border border-zinc-200/60 font-sans text-xs text-zinc-600 space-y-1 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-1.5 mb-1.5">
            <span className="font-bold text-zinc-900 font-chakra-petch uppercase tracking-wider text-[10px]">Endereço de Envio</span>
            <span className="text-zinc-400 font-medium font-mono">{shipping?.cep}</span>
          </div>
          <p className="text-sm font-bold text-zinc-800 font-chakra-petch leading-tight">{shipping?.logradouro} - {shipping?.neighborhood}</p>
          <p className="font-medium text-zinc-500">{shipping?.city} — {shipping?.state}</p>
          {freteSelecionado !== null && (
            <div className="mt-2 pt-1.5 border-t border-zinc-200 flex justify-between items-center text-zinc-700 font-chakra-petch">
              <span className="font-medium text-[11px] text-zinc-400 uppercase tracking-wider">Frete:</span>
              <span className="font-bold text-zinc-900">R$ {formatPrice(freteSelecionado)}</span>
            </div>
          )}
          <button type="button" onClick={() => setIsModalFreteOpen(true)} className="text-[#D9A128] font-bold font-chakra-petch uppercase tracking-wide text-[10px] mt-1.5 hover:underline block cursor-pointer">
            Alterar frete
          </button>
        </div>
      )}

      {isModalFreteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 font-chakra-petch border border-zinc-200 shadow-xl">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Opções de Envio</h3>
            <div className="space-y-2">
              {[shipping?.sedex, shipping?.pac].map((option) => {
                if (!option) return null;
                const isSelected = freteSelecionado === Number(option?.price);
                return (
                  <label key={`${option?.price}-${option?.deadline}`} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-[#D9A128] bg-amber-50/40 ring-1 ring-[#D9A128]" : "border-zinc-200"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={isSelected} onChange={() => handleSelectOption(Number(option?.price))} className="accent-[#D9A128] h-4 w-4" />
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{option?.name}</p>
                        <p className="text-xs text-zinc-400 font-sans">Prazo: {option?.deadline} dias</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-zinc-900">R$ {formatPrice(Number(option?.price))}</span>
                  </label>
                );
              })}
            </div>
            <button type="button" onClick={() => setIsModalFreteOpen(false)} className="mt-6 rounded-xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider py-3 w-full text-center cursor-pointer">Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}