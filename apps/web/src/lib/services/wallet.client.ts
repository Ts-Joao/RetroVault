import api from '../axios'

type Wallet = {
  id: string
  balance: string | number
  userId: string
}

type WalletTransaction = {
  id: string
  amount: string | number
  type: string
  description: string
  createdAt: string
}

export async function getWallet(userId: string): Promise<Wallet> {
  const { data } = await api.get<Wallet>('/wallet', { headers: { 'user-id': userId } })
  return data
}

export async function getWalletHistory(userId: string): Promise<WalletTransaction[]> {
  const { data } = await api.get<WalletTransaction[]>('/wallet/statement', { headers: { 'user-id': userId } })
  return data ?? []
}

export async function depositWallet(userId: string, amount: number): Promise<Wallet> {
  const { data } = await api.patch<Wallet>('/wallet/deposit', { userId, amount })
  return data
}
