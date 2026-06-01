"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    router.push("/Login");
  }

  const navItems = [
    { key: "painelinicial", label: "Seus produtos" },
    { key: "painelPostSeller", label: "Cadastrar Produto" },
    { key: "painelEditSeller", label: "Editar um Produto" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#F2EFDC",
        fontFamily: "'Georgia', serif",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          minWidth: "220px",
          backgroundColor: "#261F1A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 0",
          gap: "8px",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "32px", padding: "0 20px" }}>
          <Image src={logo} alt="RetroVault" width={140} height={60} style={{ objectFit: "contain" }} />
        </div>

        {/* Nav items */}
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setAbaAtual(item.key)}
            style={{
              width: "100%",
              padding: "14px 24px",
              textAlign: "left",
              background: abaAtual === item.key ? "#BF372A" : "transparent",
              color: abaAtual === item.key ? "#F2EFDC" : "#A6A39F",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: abaAtual === item.key ? "bold" : "normal",
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.01em",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {item.label}
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "14px 24px",
            textAlign: "left",
            background: "transparent",
            color: "#A6A39F",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: "'Georgia', serif",
          }}
        >
          ← Sair
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "16px 32px",
            borderBottom: "1px solid #A6A39F44",
            backgroundColor: "#F2EFDC",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                color: "#BF372A",
                fontWeight: "bold",
                fontSize: "15px",
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.03em",
              }}
            >
              {userName || "NOME do Vendedor"}
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#D9A13B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              👤
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "32px" }}>
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