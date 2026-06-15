'use client'

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
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-200 p-4">
      <h1 className="text-2xl font-barlow-condensed font-bold text-red-600">Filtros</h1>

      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Preço mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="rounded border border-red-700 p-2 font-barlow-condensed text-xl font-semibold text-red-600"
        />

        <input
          type="number"
          placeholder="Preço máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="rounded border border-red-700 p-2 font-barlow-condensed text-xl font-semibold text-red-600"
        />
      </div>

      <div className="flex flex-col gap-5">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded border border-red-700 p-2 font-barlow-condensed text-xl font-semibold text-red-600"
        >
          <option value="">Todos os tipos</option>
          <option value="game">Jogo</option>
          <option value="movie">Filme</option>
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded border border-red-700 p-2 font-barlow-condensed text-xl font-semibold text-red-600"
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
