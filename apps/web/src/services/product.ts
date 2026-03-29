import { Product, ProductDetails } from "@retrovault/core"

export async function getProducts(): Promise<Product[]> {
    return mockProducts
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts()
    return products.find(product => product.id === id)
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'EA Sport F1 25 - Play Station 5',
    price: 353.30,
    photo: '/image/f1-25.webp',
    seller: 'Play Station',
    rating: 4.5,
    max_installments: 12,
    free_installments: 10,
    min_installment_amount: 20,
    monthly_interest_rate: 0.02,
    shipping_cost: 0
  },
  {
    id: '2',
    name: 'Shadow of the Colossus PS4 Remake',
    price: 154,
    photo: '/image/shadow-of-the-colossus.png',
    seller: 'Play Station',
    rating: 4,
    max_installments: 6,
    free_installments: 3,
    min_installment_amount: 10,
    monthly_interest_rate: 0.03,
    shipping_cost: 20
  },
  {
    id: '3',
    name: 'Pokemon Legends Z-A Nintendo Switch 2',
    price: 380.37,
    photo: '/image/pokemon-legends-za.webp',
    seller: 'Nintendo Oficial',
    rating: 5,
    max_installments: 12,
    free_installments: 8,
    min_installment_amount: 20,
    monthly_interest_rate: 0.05,
    shipping_cost: 10
  },
]