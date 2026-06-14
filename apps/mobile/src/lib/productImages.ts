import { ImageSourcePropType } from "react-native"
import type { Product } from "@retrovault/core"

export const productImages: Record<string, ImageSourcePropType> = {
  '1': require('../../assets/image/f1-25.webp'),
  '2': require('../../assets/image/shadow-of-the-colossus.png'),
  '3': require('../../assets/image/pokemon-legends-za.webp'),
  '4': require('../../assets/image/zelda-breath-of-the-wild.webp'),
  '5': require('../../assets/image/metal-gear-solid-v-the-phantom-pain.ps4.webp'),
  '6': require('../../assets/image/sonic-x-shadow-generations.nintendo-switch.webp'),
}

export function getProductImage(product: Pick<Product, 'id'>): ImageSourcePropType {
  return productImages[product.id] ?? { uri: 'https://placehold.co/400x400?text=Sem+Imagem' }
}
