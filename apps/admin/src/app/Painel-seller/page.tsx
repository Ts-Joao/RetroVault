"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdPerson } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

import PainelInicialSeller from "@/components/painel-seller/Painel-inicial-seler/page";
import PainelPostSeller from "@/components/painel-seller/Painel-criar-seller/page";
import PainelEditSeller from "@/components/painel-seller/painel-editar-seller/page";
import { authFetch } from "@/lib/authFetch";
import { useSellerDashboardStore } from "@/lib/stores/useSellerDashboardStore";

import logo from "@/../public/logo.png";

export default function PainelSellerPage() {
  const router = useRouter();
  const { abaAtual, setAbaAtual, userName, setUserName, selectedProductId, setSelectedProductId } = useSellerDashboardStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string; email: string; role: string }>(token);

      authFetch(`/api/users/${decoded.sub}`)
        .then((res) => res.json())
        .then((user) => {
          setUserName(user.name || decoded.email);
        })
        .catch(() => {
          setUserName(decoded.email);
        });
    } catch {
      setUserName("");
    }
  }, [router, setUserName]);

  // Certifique-se de que o componente PainelInicialSeller chame a prop 'onEditProduct(id)' no clique do botão de editar
  function handleEditProduct(id: string) {
    setSelectedProductId(id);
    setAbaAtual("painelEditSeller");
  }

  async function handleLogout() {
    try {
      await authFetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    router.push("/");
  }

  const navItems = [
    { key: "painelinicial", label: "Seus produtos" },
    { key: "painelPostSeller", label: "Cadastrar Produto" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F6F0] font-sans antialiased text-[#261F1A]">
      {/* Sidebar Lateral */}
      <aside className="flex w-[240px] min-w-[240px] flex-col border-r border-[#A6A39F33] bg-[#F2EFDC] py-6 shadow-sm">
        <div className="mb-8 flex justify-center px-6">
          <Image src={logo} alt="RetroVault" width={140} height={60} className="object-contain" />
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setAbaAtual(item.key)}
              className={`w-full rounded-lg px-4 py-3 text-left text-[14px] font-medium tracking-wide transition-all duration-150 ${
                abaAtual === item.key || (item.key === "painelinicial" && abaAtual === "painelEditSeller")
                  ? "bg-[#BF372A] text-white shadow-sm"
                  : "text-[#59524C] hover:bg-[#A6A39F22] hover:text-[#261F1A]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="px-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-[14px] font-medium text-[#BF372A] transition-colors hover:bg-[#BF372A11]"
          >
            ← Sair da conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="flex h-[70px] items-center justify-end border-b border-[#A6A39F33] bg-white px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold tracking-wide text-[#261F1A]">
              {userName || "Vendedor"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2EFDC] border border-[#A6A39F44]">
              <MdPerson className="text-[#BF372A] text-xl" />
            </div>
          </div>
        </header>

        {/* Área de Visualização */}
        <main className="flex-1 overflow-auto bg-[#F8F6F0] p-8">
          <div className="mx-auto max-w-6xl bg-white p-6 rounded-xl shadow-sm border border-[#A6A39F22]">
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
          </div>
        </main>
      </div>
    </div>
  );
}