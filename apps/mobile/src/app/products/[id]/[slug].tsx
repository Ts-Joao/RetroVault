import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { ProductDetails } from "@retrovault/core"
import { getProductById } from "@/services/product.service"
import ProductDetail from "@/components/Product/ProductDetail"

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string; slug: string }>()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getProductById(id).then((found) => {
      setProduct(found ?? null)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-100">
        <ActivityIndicator size="large" color="#BF372A" />
      </View>
    )
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-100 px-6">
        <Text className="text-lg font-chakra text-stone-600 text-center">
          Produto não encontrado
        </Text>
      </View>
    )
  }

  return <ProductDetail product={product} />
}
