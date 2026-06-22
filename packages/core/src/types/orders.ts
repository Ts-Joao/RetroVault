export interface Order {
  id: string
  userId: string
  sellerId: string
  productId: string
  quantity: number
  total: number
  status: OrderStatus
  items?: OrderItem[]
}

export interface OrderItem {
  productId: string
  quantity: number
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
