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
    if (products.length === 0) return { label: "SEM DADOS", color: "text-[#A6A39F]" };
    if (totalRevenue > 5000) return { label: "ÓTIMO", color: "text-green-600" };
    if (totalRevenue > 1000) return { label: "BOM", color: "text-[#D9A13B]" };
    return { label: "PÉSSIMO", color: "text-[#BF372A]" };
  };

  const perf = performance();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl font-bold text-[#261F1A] mb-4 font-serif">
          Principais Produtos:
        </h2>

        {loading ? (
          <p className="text-[#A6A39F] animate-pulse">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="text-[#A6A39F]">Nenhum produto cadastrado ainda.</p>
        ) : (
          <>
            <div className="flex gap-4 flex-wrap">
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
                className="mt-4 bg-none border-none text-[#BF372A] cursor-pointer text-sm font-bold underline hover:text-[#261F1A] transition-colors"
              >
                {showAll ? "Mostrar menos" : "Mostrar mais"}
              </button>
            )}
          </>
        )}
      </section>

      {/* Stats */}
      <section className="flex gap-6 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm text-[#261F1A] mb-2 font-bold uppercase tracking-wider">
            Receita Total:
          </p>
          <div className="bg-[#A6A39F33] rounded-xl p-6 text-center border border-[#A6A39F44]">
            <span className="text-3xl font-bold text-[#261F1A]">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <p className="text-sm text-[#261F1A] mb-2 font-bold uppercase tracking-wider">
            Produtos Cadastrados:
          </p>
          <div className="bg-[#A6A39F33] rounded-xl p-6 text-center border border-[#A6A39F44]">
            <span className="text-3xl font-bold text-[#261F1A]">
              {products.length}
            </span>
          </div>
        </div>
      </section>

      {/* Performance */}
      <section className="bg-[#A6A39F11] p-5 rounded-xl border border-[#A6A39F22] flex items-center justify-between max-w-xs">
        <p className="text-sm text-[#261F1A] font-bold uppercase tracking-wider">
          Desempenho Geral:
        </p>

        <span className={`text-2xl font-black ${perf.color} tracking-widest`}>
          {perf.label}
        </span>
      </section>
    </div>
  );
}