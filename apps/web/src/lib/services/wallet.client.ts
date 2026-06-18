import api from '../axios'

type Wallet = {
  id: string
  balance: number
  userId: string
  payment: {
    confirmationCode: string
  }
  walletTopUp: {
    id: string
  }
}

type WalletTransaction = {
  id: string
  amount: number
  type: 'DEPOSIT' | 'WITHDRAW' | 'PURCHASE'
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

export async function depositWallet(userId: string, dto: { amount: number; type: string; paymentMethod: string }): Promise<Wallet> {
  const { data } = await api.post<Wallet>('/wallet/deposit', { userId, ...dto })
  return data
}
