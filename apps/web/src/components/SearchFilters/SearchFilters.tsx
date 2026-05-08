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
    <div className="flex flex-col gap-4 mb-8">

      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Preço mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Preço máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-4">

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos os tipos</option>
          <option value="game">Jogo</option>
          <option value="movie">Filme</option>
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
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