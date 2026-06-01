"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { MdPerson } from "react-icons/md"; 

import PainelInicialSeller from "@/components/painel-seller/Painel-inicial-seler/page";
import PainelPostSeller from "@/components/painel-seller/Painel-criar-seller/page";
import PainelEditSeller from "@/components/painel-seller/painel-editar-seller/page";

import logo from "@/../public/logo.png";

export default function PainelSellerPage() {
  const router = useRouter();
  const [abaAtual, setAbaAtual] = useState("painelinicial");
  const [userName, setUserName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
      return;
    }
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  function handleEditProduct(id: string) {
    setSelectedProductId(id);
    setAbaAtual("painelEditSeller");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/");
  }

  const navItems = [
    { key: "painelinicial", label: "Seus produtos" },
    { key: "painelPostSeller", label: "Cadastrar Produto" },
    { key: "painelEditSeller", label: "Editar um Produto" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F2EFDC] font-serif">
  <aside className="flex w-[220px] min-w-[220px] flex-col items-center gap-2 bg-[#A6A39F] py-6">
    <div className="mb-8 px-5">
      <Image
        src={logo}
        alt="RetroVault"
        width={140}
        height={60}
        className="object-contain"
      />
    </div>

    {navItems.map((item) => (
      <button
        key={item.key}
        onClick={() => setAbaAtual(item.key)}
        className={`w-full px-6 py-3.5 text-left text-[15px] tracking-[0.01em] transition-colors duration-200 ${
          abaAtual === item.key
            ? "bg-[#BF372A] font-bold text-[#F2EFDC]"
            : "text-[#261F1A]"
        }`}
      >
        {item.label}
      </button>
    ))}

    <div className="flex-1" />

    <button
      onClick={handleLogout}
      className="w-full px-6 py-3.5 text-left text-sm text-[#261F1A]"
    >
      ← Sair
    </button>
  </aside>

  <div className="flex flex-1 flex-col overflow-hidden">
    <header className="flex items-center justify-end border-b border-[#A6A39F44] bg-[#F2EFDC] px-8 py-4">
      <div className="flex items-center gap-2.5">
        <span className="text-[15px] font-bold tracking-[0.03em] text-[#BF372A]">
          {userName || "NOME do Vendedor"}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full text-base">
          <MdPerson className=" text-red-500 text-4xl  "/>
        </div>
      </div>
    </header>

    <main className="flex-1 overflow-auto p-8">
      {abaAtual === "painelinicial" && (
        <PainelInicialSeller onEditProduct={handleEditProduct} />
      )}

      {abaAtual === "painelPostSeller" && <PainelPostSeller />}

      {abaAtual === "painelEditSeller" && (
        <PainelEditSeller
          productId={selectedProductId}
          onBack={() => setAbaAtual("painelinicial")}
        />
      )}
    </main>
  </div>
</div>
  );
}