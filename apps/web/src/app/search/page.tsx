
'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Product } from "@retrovault/core"
import { searchProducts } from "../../../../../packages/core/src/utils/search" 

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<Product[]>([])

  useEffect(() => {
    async function fetchData() {
      const data = await searchProducts(query)
      setResults(data)
    }

    fetchData()
  }, [query])

  return (
    <div>
      <h1>Resultados para: "{query}"</h1>

      {results.length === 0 && <p>Nenhum resultado encontrado</p>}

      {results.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>R$ {product.price}</p>
        </div>
      ))}
    </div>
  )
}