"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product, User } from "@retrovault/core";
import { searchProducts } from "@retrovault/core";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import { mockProducts } from "@/lib/services/product.service";
import ProductGrid from "@/components/layout/product-grid/ProductGrid";
import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";

  const users: User[] = [];

  const [results, setResults] = useState<Product[]>([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [type, setType] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = searchProducts(mockProducts, {
        query,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        type,
        genre,
      });

      setResults(data);
    }

    fetchData();
  }, [query, minPrice, maxPrice, type, genre]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        <h1 className="text-2xl font-bold m-6">Resultados para: "{query}"</h1>

        <section className="flex gap-5 m-6 items-start">
          <SearchFilters
            minPrice={minPrice}
            maxPrice={maxPrice}
            type={type}
            genre={genre}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setType={setType}
            setGenre={setGenre}
          />

          {results.length === 0 && <p>Nenhum resultado encontrado</p>}

          <div>
            <ProductGrid products={results} users={users} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
