'use client'

import { PiCurrencyDollarBold, PiTagBold, PiFilmStripBold } from "react-icons/pi"
type Props = {
  minPrice: string
  maxPrice: string
  type: string
  genre: string

  setMinPrice: (value: string) => void
  setMaxPrice: (value: string) => void
  setType: (value: string) => void
  setGenre: (value: string) => void
}

export default function SearchFilters({
  minPrice,
  maxPrice,
  type,
  genre,
  setMinPrice,
  setMaxPrice,
  setType,
  setGenre
}: Props) {
  return (
    <div className="space-y-5 font-chakra-petch">
      
      {/* Grupo de Faixa de Preço */}
      <div className="space-y-2">
        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <PiCurrencyDollarBold className="text-[#CD463A]" />
          Faixa de Valor
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2 px-3 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all text-zinc-800 placeholder:text-zinc-400"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2 px-3 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all text-zinc-800 placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Categoria / Tipo */}
      <div className="space-y-2">
        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <PiTagBold className="text-[#CD463A]" />
          Tipo de Artefato
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-3 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all text-zinc-700 cursor-pointer"
        >
          <option value="">Todos os tipos</option>
          <option value="game">Jogo</option>
          <option value="movie">Filme</option>
        </select>
      </div>

      {/* Gênero */}
      <div className="space-y-2">
        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <PiFilmStripBold className="text-[#CD463A]" />
          Gênero / Classificação
        </label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-3 text-sm font-bold focus:outline-none focus:border-[#CD463A] transition-all text-zinc-700 cursor-pointer"
        >
          <option value="">Todos os gêneros</option>
          <option value="action">Ação</option>
          <option value="adventure">Aventura</option>
          <option value="racing">Corrida</option>
          <option value="sports">Esporte</option>
          <option value="rpg">RPG</option>
          <option value="stealth">Stealth</option>
        </select>
      </div>

    </div>
  )
}