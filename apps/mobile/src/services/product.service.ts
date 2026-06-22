import { Product } from "@retrovault/core"
import { searchProducts as apiSearchProducts } from "@/lib/api"

// Shape que o backend Prisma retorna (camelCase)
export interface ApiProduct {
    id: string
    name: string
    price: number | string
    photos: { id: string; url: string; productId: string }[]
    sellerId: string
    rating: number | string | null
    maxInstallments: number | null
    freeInstallments: number | null
    monthlyInterestRate: number | string | null
    minInstallmentAmount: number | string | null
    shippingCost: number | string | null
    genre: { id: number; name: string }[]
    mediaType?: { id: number; name: string } | null
    slug: string
    cep?: string
    city?: string | null
    state?: string | null
    seller?: { id: string; name: string }
}

// Converte o shape do backend para o shape do ProductCard (core)
export function adaptApiProduct(p: ApiProduct): Product {
    return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        photos: p.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            productId: photo.productId,
        })),
        sellerId: p.sellerId,
        rating: Number(p.rating ?? 0),
        max_installments: p.maxInstallments ?? 1,
        free_installments: p.freeInstallments ?? 1,
        monthly_interest_rate: Number(p.monthlyInterestRate ?? 0),
        min_installment_amount: Number(p.minInstallmentAmount ?? 0),
        shipping_cost: Number(p.shippingCost ?? 0),
        type: p.mediaType ? [p.mediaType.name] : [],
        genre: p.genre ? p.genre.map((g) => g.name) : [],
        cep: p.cep ?? '',
        city: p.city ?? '',
        state: p.state ?? '',
    }
}

export async function getProducts(): Promise<Product[]> {
    return mockProducts
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts()
    return products.find(product => product.id === id)
}

export function getProductsByUserId(userId: string): Product[] {
    return mockProducts.filter((p) => p.sellerId === userId)
}

export async function searchProducts(query: string): Promise<Product[]> {
    const raw: ApiProduct[] = await apiSearchProducts(query)
    return raw.map(adaptApiProduct)
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'EA Sport F1 25 - Play Station 5',
    price: 353.30,
    photos: [{ id: '1-photo', url: '1', productId: '1' }],
    sellerId: '2',
    rating: 4.5,
    max_installments: 12,
    free_installments: 10,
    min_installment_amount: 20,
    monthly_interest_rate: 0.02,
    shipping_cost: 0,
    type: ['Game'],
    genre: ['Racing', 'Sports'],
    cep: '',
    city: '',
    state: '',
  },
  {
    id: '2',
    name: 'Shadow of the Colossus PS4 Remake',
    price: 154,
    photos: [{ id: '2-photo', url: '2', productId: '2' }],
    sellerId: '2',
    rating: 4,
    max_installments: 6,
    free_installments: 3,
    min_installment_amount: 10,
    monthly_interest_rate: 0.03,
    shipping_cost: 20,
    type: ['Game'],
    genre: ['Action', 'Adventure'],
    cep: '',
    city: '',
    state: '',
  },
  {
    id: '3',
    name: 'Pokemon Legends Z-A Nintendo Switch 2',
    price: 380.37,
    photos: [{ id: '3-photo', url: '3', productId: '3' }],
    sellerId: '3',
    rating: 5,
    max_installments: 12,
    free_installments: 8,
    min_installment_amount: 20,
    monthly_interest_rate: 0.05,
    shipping_cost: 10,
    type: ['Game'],
    genre: ['RPG', 'Adventure'],
    cep: '',
    city: '',
    state: '',
  },
  {
    id: '4',
    name: 'Zelda Breath of the Wild Nintendo Switch',
    price: 409.11,
    photos: [{ id: '4-photo', url: '4', productId: '4' }],
    sellerId: '3',
    rating: 5,
    free_installments: 2,
    max_installments: 6,
    min_installment_amount: 20,
    monthly_interest_rate: 0.02,
    shipping_cost: 10,
    type: ['Game'],
    genre: ['Action', 'Adventure'],
    cep: '',
    city: '',
    state: '',
  },
  {
    id: '5',
    name: 'Metal gear solid V: The Phantom Pain PS4',
    price: 224.00,
    photos: [{ id: '5-photo', url: '5', productId: '5' }],
    sellerId: '2',
    rating: 4.5,
    free_installments: 3,
    max_installments: 6,
    min_installment_amount: 20,
    monthly_interest_rate: 0.04,
    shipping_cost: 10,
    type: ['Game'],
    genre: ['Action', 'Stealth'],
    cep: '',
    city: '',
    state: '',
  },
  {
    id: '6',
    name: 'Sonic x shadow generations Nintendo Switch',
    price: 251.00,
    photos: [{ id: '6-photo', url: '6', productId: '6' }],
    sellerId: '3',
    rating: 5,
    free_installments: 2,
    max_installments: 8,
    min_installment_amount: 10,
    monthly_interest_rate: 0.05,
    shipping_cost: 10,
    type: ['Game'],
    genre: ['Platform', 'Action'],
    cep: '',
    city: '',
    state: '',
  },
]
