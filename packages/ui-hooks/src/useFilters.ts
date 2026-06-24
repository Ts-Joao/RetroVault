import { useState, useCallback } from 'react'

export type FilterState = {
  category: string | null
  priceRange: [number, number] | null
  condition: 'new' | 'used' | null
}

const initialState: FilterState = {
  category: null,
  priceRange: null,
  condition: null,
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(initialState)

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialState)
  }, [])

  const activeCount = Object.values(filters).filter(v => v !== null).length

  return { filters, updateFilter, resetFilters, activeCount }
}