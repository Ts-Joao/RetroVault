import { create } from 'zustand'

type WalletTransaction = {
  id: string
  amount: number
  type: string
  description: string
  createdAt: string
}

type Wallet = {
  id: string
  balance: number
  userId: string
}

type WalletStore = {
  wallet: Wallet | null
  history: WalletTransaction[]
  isLoading: boolean
  setWallet: (wallet: Wallet | null) => void
  setHistory: (history: WalletTransaction[]) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  history: [],
  isLoading: false,
  setWallet: (wallet) => set({ wallet }),
  setHistory: (history) => set({ history }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ wallet: null, history: [], isLoading: false }),
}))
