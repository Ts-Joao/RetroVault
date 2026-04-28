'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSearch() {
    if (!query) return
    router.push(`/search?q=${query}`)
  }

  return (
    <div>
      <input
        placeholder="Buscar produto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  )
}