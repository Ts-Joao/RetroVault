"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  rating?: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Derived stats
  const totalRevenue = products.reduce((acc, p) => acc + Number(p.price), 0);
  const totalSold = products.reduce((acc, p) => acc + (p.amount > 0 ? 0 : 1), 0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await authFetch("/api/products?seller=me");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        // API returns paginated: { data: Product[], meta: ... } or plain array
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

  const ratingStars = (rating: number = 0) => {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  };

  // Simple performance label
  const performance = () => {
    if (products.length === 0) return { label: "SEM DADOS", color: "#A6A39F" };
    if (totalRevenue > 5000) return { label: "ÓTIMO", color: "#2a9d2a" };
    if (totalRevenue > 1000) return { label: "BOM", color: "#D9A13B" };
    return { label: "PÉSSIMO", color: "#BF372A" };
  };

  const perf = performance();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Products section */}
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
                <div
                  key={product.id}
                  style={{
                    width: "160px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {/* Edit icon */}
                  <button
                    onClick={() => onEditProduct?.(product.id)}
                    title="Editar produto"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      background: "#BF372A",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      cursor: "pointer",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      zIndex: 1,
                    }}
                  >
                    ✎
                  </button>

                  {/* Foto */}
                  <div
                    style={{
                      width: "100%",
                      height: "110px",
                      backgroundColor: "#A6A39F33",
                      overflow: "hidden",
                    }}
                  >
                    {product.photos && product.photos[0] ? (
                      <img
                        src={product.photos[0].url}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#A6A39F",
                          fontSize: "12px",
                        }}
                      >
                        Sem foto
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div style={{ padding: "8px" }}>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#261F1A",
                        margin: "0 0 2px",
                        lineHeight: "1.3",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.name}
                    </p>

                    {product.seller && (
                      <p style={{ fontSize: "10px", color: "#A6A39F", margin: "0 0 4px" }}>
                        Por: {product.seller.name}
                      </p>
                    )}

                    <div style={{ color: "#D9A13B", fontSize: "11px" }}>
                      {ratingStars(Number(product.rating))}
                    </div>

                    <p style={{ fontSize: "13px", fontWeight: "bold", color: "#261F1A", margin: "4px 0 2px" }}>
                      R${Number(product.price).toFixed(2)}
                    </p>

                    {product.maxInstallments && product.maxInstallments > 1 && (
                      <p style={{ fontSize: "10px", color: "#A6A39F" }}>
                        {product.maxInstallments}x R${(Number(product.price) / product.maxInstallments).toFixed(2)}
                      </p>
                    )}

                    <button
                      style={{
                        marginTop: "6px",
                        width: "100%",
                        backgroundColor: "#D9A13B",
                        color: "#261F1A",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Comprar agora 🛒
                    </button>
                  </div>
                </div>
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
        <div
          style={{
            flex: 1,
            minWidth: "200px",
          }}
        >
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
              R${totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "16px", color: "#261F1A", marginBottom: "8px", fontWeight: "bold" }}>
            Produtos Vendidos:
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
            {perf.label === "ÓTIMO" ? "✅" : perf.label === "BOM" ? "📈" : "📉"}
          </span>
        </div>
      </section>
    </div>
  );
}