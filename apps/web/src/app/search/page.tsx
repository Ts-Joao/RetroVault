"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@retrovault/core";
import { searchProducts } from "../../../../../packages/core/src/utils/search";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import { mockProducts } from "@/services/product";

export default function SearchPage() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Resultados para: "{query}"</h1>

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

      <div className="flex flex-col gap-4">
        {results.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="font-bold">{product.name}</h2>

            <p>R$ {product.price}</p>

            <p>Tipo: {product.type.join(", ")}</p>

            <p>Gênero: {product.genre.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
