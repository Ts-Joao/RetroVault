"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PiKeyBold, PiArrowLeftBold } from "react-icons/pi";
import { confirmPayment } from "@/lib/services/payment.client";
import { useCartStore } from "@retrovault/store";
import { useCheckoutStore } from "@/store/checkout.store";
import { useAuth } from "@/lib/context/auth.context";
import { useToast } from "@/components/ui/toast-provider";

export default function PaymentConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const { user } = useAuth();
  
  const orderId = params.orderId as string;
  const { clearCart } = useCartStore();

  const [insertedToken, setInsertedToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirmLiquidation(e: React.FormEvent) {
    e.preventDefault();

    if (!insertedToken.trim()) {
      return toast.error("Por favor, insira o token de validação.");
    }

    setLoading(true);
    try {
      await confirmPayment(insertedToken.trim());
      toast.success("Pagamento confirmado com sucesso!");
      
      clearCart();
      useCheckoutStore.getState().resetCheckout?.();
      
      router.push(`/profile/${user?.sub}/${user?.slug}`);
    } catch (error) {
      toast.error("Token inválido ou erro ao processar liquidação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-[95%] max-w-xl py-12 font-chakra-petch space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-md space-y-6">
        
        <button 
          type="button" 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold uppercase tracking-wide hover:text-zinc-700 transition cursor-pointer"
        >
          <PiArrowLeftBold /> Voltar aos dados de pagamento
        </button>

        <div className="text-center space-y-1">
          <div className="mx-auto w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-2 shadow-sm">
            <PiKeyBold />
          </div>
          <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Inserir Token de Confirmação</h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xs mx-auto">
            Insira o hash do token disponibilizado na tela anterior para efetivar e liquidar o pedido no banco.
          </p>
        </div>

        <form onSubmit={handleConfirmLiquidation} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Token de Segurança</label>
            <input 
              type="text"
              required
              placeholder="Cole ou digite o hash do token aqui..."
              value={insertedToken}
              onChange={(e) => setInsertedToken(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm font-mono focus:outline-none focus:border-zinc-500 text-zinc-800 bg-zinc-50/40 font-bold placeholder-zinc-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !insertedToken.trim()}
            className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 cursor-pointer text-center"
          >
            {loading ? "Validando e Confirmando..." : "Confirmar e Liquidar Pedido"}
          </button>
        </form>

      </div>
    </div>
  );
}