import 'server-only'
import type { Order } from '@retrovault/core'
import { getServerApi } from '../axios.server'

export async function getOrdersByUserId(userId: string) {
  const api = await getServerApi()
  const { data } = await api.get<Order[]>(`/orders/user/${userId}`)
  return data ?? []
}

export async function getOrderById(id: string) {
  const api = await getServerApi()
  const { data } = await api.get<Order>(`/orders/${id}`)
  return data
}

export async function getAllOrders() {
  const api = await getServerApi()
  const { data } = await api.get<Order[]>(`/orders`)
  return data ?? []
}
