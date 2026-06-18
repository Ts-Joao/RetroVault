import { create } from 'zustand'

type SellerDashboardStore = {
  abaAtual: string
  userName: string
  selectedProductId: string | null
  setAbaAtual: (aba: string) => void
  setUserName: (name: string) => void
  setSelectedProductId: (id: string | null) => void
}

export const useSellerDashboardStore = create<SellerDashboardStore>((set) => ({
  abaAtual: 'painelinicial',
  userName: '',
  selectedProductId: null,
  setAbaAtual: (abaAtual) => set({ abaAtual }),
  setUserName: (userName) => set({ userName }),
  setSelectedProductId: (selectedProductId) => set({ selectedProductId }),
}))
