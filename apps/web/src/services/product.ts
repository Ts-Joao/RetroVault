import { Product, ProductDetails } from "@retrovault/core"

export async function getProducts(): Promise<Product[]> {
    return mockProducts
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts()
    return products.find(product => product.id === id)
}

export function getProductsByUserId(userId: string): Product[] {
    return mockProducts.filter((p) => p.seller_id === userId)
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'EA Sport F1 25 - Play Station 5',
    price: 353.30,
    photo: '/image/f1-25.webp',
    seller_id: '2',
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
    seller_id: '2',
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
    seller_id: '3',
    rating: 5,
    max_installments: 12,
    free_installments: 8,
    min_installment_amount: 20,
    monthly_interest_rate: 0.05,
    shipping_cost: 10
  },
  {
    id: '4',
    name: 'Zelda Breath of the Wild Nintendo Switch',
    price: 409.11,
    photo: '/image/zelda-breath-of-the-wild.webp',
    seller: 'Nintendo Oficial',
    installment_amount: 12,
    installment_number: 36.75,
    rating: 5,
    shipping_cost: 10
  },
  {
    id: '5',
    name: 'Metal gear solid V: The Phantom Pain PS4',
    price: 224.00,
    photo: '/image/metal-gear-solid-v-the-phantom-pain.ps4.webp',
    seller: 'Play Station',
    installment_amount: 2,
    installment_number: 112.00,
    rating: 4.5,
    shipping_cost: 10
  },
  {
    id: '6',
    name: 'Sonic x shadow generations Nintendo Switch',
    price: 251.00,
    photo: '/image/sonic-x-shadow-generations.nintendo-switch.webp',
    seller: 'Nintendo Oficial',
    installment_amount: 2,
    installment_number: 125.50,
    rating: 5,
    shipping_cost: 10
  },
]