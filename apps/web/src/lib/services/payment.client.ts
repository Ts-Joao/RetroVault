import api from '../axios'

export async function simulatePayment(orderId: string, userId: string) {
  const { data } = await api.post<string>(`/payment/simulation/${orderId}`, {}, {
    headers: { 'user-id': userId },
  })
  return data
}

export async function confirmPayment(token: string) {
  const { data } = await api.patch<string>(`/payment/confirmation/${token}`)
  return data
}
