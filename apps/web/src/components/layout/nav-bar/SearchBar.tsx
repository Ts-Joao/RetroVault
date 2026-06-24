'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { PiMagnifyingGlassBold } from "react-icons/pi"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="relative w-full max-w-md group mx-auto"
    >
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#D9A128] transition-colors">
        <PiMagnifyingGlassBold className="text-lg" />
      </div>
      
      <input
        type="text"
        placeholder="Buscar tesouros no cofre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-chakra-petch font-medium placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#D9A128] focus:ring-4 focus:ring-amber-50 transition-all duration-200"
      />
    </form>
  )
}