"use client";

import { useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { PiQrCodeBold, PiBarcodeBold, PiCheckCircleBold, PiCopyBold, PiArrowRightBold, PiArrowsLeftRightBold, PiWalletBold } from "react-icons/pi";
import { useToast } from "@/components/ui/toast-provider";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";

export default function DepositDisplayPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  const transactionId = params.transactionId as string;
  const method = searchParams.get("method") || "pix";
  
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  function handleCopyToken() {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="mx-auto w-[95%] max-w-xl py-12 font-chakra-petch space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-md text-center space-y-6">
        
        <div className="mx-auto w-16 h-16 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center justify-center text-yellow-600 text-3xl">
          <PiWalletBold />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">
            {method === "pix" 
              ? "Depósito via Pix" 
              : method === "credit_card" 
                ? "Depósito via Cartão de Crédito" 
                : "Depósito via Cartão de Débito"}
          </h1>
          <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
            {method === "pix" 
              ? "Clique no card para alternar entre o design estético e o QR Code real."
              : "Seu cartão gerou uma validação de segurança. Utilize o código de barras abaixo."}
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
          
          {method === "pix" ? (
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-48 h-48 cursor-pointer [perspective:1000px] group select-none"
            >
              <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute inset-0 w-full h-full bg-zinc-900 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center p-4 text-white [backface-visibility:hidden]">
                  <PiQrCodeBold className="text-6xl text-yellow-500" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">RetroVault-WALLET</span>
                  <span className="text-[10px] text-zinc-500 mt-4 flex items-center gap-1 font-sans"><PiArrowsLeftRightBold /> Clique para girar</span>
                </div>
                <div className="absolute inset-0 w-full h-full bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <QRCode value={transactionId} size={140} viewBox={`0 0 256 256`} className="w-full h-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-4xl text-zinc-400 py-6">
              <div className="w-full flex items-center justify-center text-4xl text-zinc-400 py-6l">
                <Barcode value={transactionId} />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono mt-4">RetroVault-BARCODE</span>
            </div>
          )}

          <div className="w-full space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              {method === "pix" ? "Código Copia e Cola" : "Linha Digitável / Token"}
            </span>
            <div className="flex gap-2">
              <div className="flex-1 bg-white border rounded-xl px-4 py-2.5 font-mono text-xs text-zinc-500 break-all border-zinc-200 select-all font-bold flex items-center">
                {transactionId}
              </div>
              <button
                onClick={handleCopyToken}
                type="button"
                className="bg-zinc-900 text-white rounded-xl px-4 flex items-center justify-center hover:bg-zinc-800 transition cursor-pointer shrink-0 text-sm"
              >
                {copied ? <PiCheckCircleBold className="text-emerald-400 text-lg" /> : <PiCopyBold />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => router.push(`/wallet/deposit/${transactionId}/confirm`)}
            className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm shadow-sm transition hover:bg-zinc-800 cursor-pointer flex items-center justify-center gap-2"
          >
            Validar Depósito <PiArrowRightBold />
          </button>
        </div>

      </div>
    </div>
  );
}