"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { useSellerDashboardStore } from "@/lib/stores/useSellerDashboardStore";
import ProductCard from "@/components/painel-seller/product-card/page"; 

interface Product {
  id: string;
  name: string;
  price: number | string;
  discountPrice?: number;
  rating?: number | string;
  amount: number;
  photos?: { url: string }[];
  mediaType?: { name: string };
  seller?: { name: string };
  maxInstallments?: number;
  freeInstallments?: number;
}

interface Props {
  onEditProduct?: (id: string) => void;
}

export default function PainelInicialSeller({ onEditProduct }: Props) {
  const { setSelectedProductId, setAbaAtual } = useSellerDashboardStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const totalRevenue = products.reduce((acc, p) => acc + Number(p.price), 0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await authFetch("/api/products");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        console.log(data[0]);
        console.log(data[0].photos);
        setProducts(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const displayedProducts = showAll ? products : products.slice(0, 5);

  const performance = () => {
    if (products.length === 0) return { label: "SEM DADOS", color: "#A6A39F" };
    if (totalRevenue > 5000) return { label: "ÓTIMO", color: "#2a9d2a" };
    if (totalRevenue > 1000) return { label: "BOM", color: "#D9A13B" };
    return { label: "PÉSSIMO", color: "#BF372A" };
  };

  const perf = performance();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#261F1A",
            marginBottom: "16px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Principais Produtos:
        </h2>

        {loading ? (
          <p style={{ color: "#A6A39F" }}>Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p style={{ color: "#A6A39F" }}>Nenhum produto cadastrado ainda.</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(id) => {
                    setSelectedProductId(id);
                    setAbaAtual("painelEditSeller");
                    onEditProduct?.(id);
                  }}
                />
              ))}
            </div>

            {products.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  marginTop: "16px",
                  background: "none",
                  border: "none",
                  color: "#BF372A",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {showAll ? "Mostrar menos" : "Mostrar mais"}
              </button>
            )}
          </>
        )}
      </section>

      {/* Stats */}
      <section style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "16px", color: "#261F1A", marginBottom: "8px", fontWeight: "bold" }}>
            Receita Total:
          </p>
          <div
            style={{
              backgroundColor: "#A6A39F44",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: "bold", color: "#261F1A" }}>
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "16px", color: "#261F1A", marginBottom: "8px", fontWeight: "bold" }}>
            Produtos Cadastrados:
          </p>
          <div
            style={{
              backgroundColor: "#A6A39F44",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: "bold", color: "#261F1A" }}>
              {products.length}
            </span>
          </div>
        </div>
      </section>

      {/* Performance */}
      <section>
        <p style={{ fontSize: "16px", color: "#261F1A", fontWeight: "bold", marginBottom: "8px" }}>
          Desempenho Geral:
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: perf.color, letterSpacing: "0.05em" }}>
            {perf.label}
          </span>
          <span style={{ fontSize: "24px" }}>
            
          </span>
        </div>
      </section>
    </div>
  );
}