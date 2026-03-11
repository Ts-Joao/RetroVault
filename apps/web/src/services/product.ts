import { Product } from "@retrovault/shared"

export async function getProducts(): Promise<Product[]> {
    return mockProducts
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'EA Sport F1 25 - Play Station 5',
    price: 353.30,
    photo: '/image/f1-25.png',
    seller: 'Play Station',
    installment_amount: 10,
    installment_number: 39.25,
    rating: 4
  }
]