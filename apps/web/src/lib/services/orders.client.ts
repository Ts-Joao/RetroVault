import api from '../axios'
import type { CartItem, Order } from '@retrovault/core'

export type PaymentMethod = 'PIX' | 'BOLETO' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'WALLET'

export async function checkoutOrder(
  userId: string,
  address: string,
  paymentMethod: PaymentMethod,
  installments: number = 1,
  orderItens?: CartItem[],
) {
  const { data } = await api.post<Order>('/orders', { address, paymentMethod, installments, orderItens }, {
    headers: { 'user-id': userId },
  })
  return data
}
