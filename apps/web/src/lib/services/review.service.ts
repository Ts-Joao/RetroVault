import { Review } from '@retrovault/core'

export async function getReview(): Promise<Review[]> {
    return mockReview
}

const mockReview: Review[] = [
    { productId: "1", id: "1", name: "Maria", comments: "jogo mito essa F1, melhor doq o sonic raciing"},
    { productId: "2", id: "2", name: "Cladio", comments: "jogo da minha infacia essa colossos" },
    { productId: "2", id: "3", name: "Joao",  comments: "Nunca vi esse jogo na minha vida"},
]