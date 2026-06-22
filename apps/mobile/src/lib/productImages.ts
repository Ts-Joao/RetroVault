import { ImageSourcePropType } from "react-native"
import type { Product } from "@retrovault/core"

// Imagens locais para os produtos do mock (IDs numéricos '1' a '6')
export const productImages: Record<string, ImageSourcePropType> = {
  '1': require('../../assets/image/f1-25.webp'),
  '2': require('../../assets/image/shadow-of-the-colossus.png'),
  '3': require('../../assets/image/pokemon-legends-za.webp'),
  '4': require('../../assets/image/zelda-breath-of-the-wild.webp'),
  '5': require('../../assets/image/metal-gear-solid-v-the-phantom-pain.ps4.webp'),
  '6': require('../../assets/image/sonic-x-shadow-generations.nintendo-switch.webp'),
}

const API_BASE = 'http://localhost:4000'

/**
 * Retorna a fonte da imagem para um produto.
 * - Se o produto tem fotos da API (url começa com '/uploads'), usa a URL do servidor.
 * - Se a foto tem uma URL de imagem externa (http/https), usa diretamente.
 * - Se a foto tem um ID numérico local ('1'-'6'), usa o require() local.
 * - Fallback: placeholder.
 */
export function getProductImage(product: Pick<Product, 'id' | 'photos'>): ImageSourcePropType {
  const firstPhoto = product.photos?.[0]

  if (firstPhoto?.url) {
    const url = firstPhoto.url

    // URL de upload do servidor (começa com /uploads)
    if (url.startsWith('/uploads')) {
      return { uri: `${API_BASE}${url}` }
    }

    // URL externa completa (http ou https)
    if (url.startsWith('http')) {
      return { uri: url }
    }

    // ID local do mock (ex: '1', '2', ...)
    if (productImages[url]) {
      return productImages[url]
    }
  }

  // Fallback por ID do produto (compatibilidade com mock antigo)
  if (productImages[product.id]) {
    return productImages[product.id]
  }

  return { uri: 'https://placehold.co/400x400/d9d9d9/666?text=Sem+Imagem' }
}
