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
    installment_amount: 10,
    installment_number: 39.25,
    rating: 4.5,
    shipping_cost: 0
  },
  {
    id: '2',
    name: 'Shadow of the Colossus PS4 Remake',
    price: 154,
    photo: '/image/shadow-of-the-colossus.png',
    seller: 'Play Station',
    installment_amount: 12,
    installment_number: 15.22,
    rating: 4,
    shipping_cost: 20
  },
  {
    id: '3',
    name: 'Pokemon Legends Z-A Nintendo Switch 2',
    price: 380.37,
    photo: '/image/pokemon-legends-za.webp',
    seller: 'Nintendo Oficial',
    installment_amount: 8,
    installment_number: 51.12,
    rating: 5,
    shipping_cost: 10
  },
]