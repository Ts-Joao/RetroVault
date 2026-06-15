import api from '../axios'
import type { Order } from '@retrovault/core'

export type PaymentMethod = 'PIX' | 'BOLETO' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'WALLET'

export async function checkoutOrder(userId: string, address: string, paymentMethod: PaymentMethod, installments = 1) {
  const { data } = await api.post<Order>('/orders', { address, paymentMethod, installments }, {
    headers: { 'user-id': userId },
  })
  return data
}
