import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Link } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import {
  ProductDetails,
  calculeCartInstallments,
  formatPrice,
  splitPrice,
} from "@retrovault/core"
import { getProductImage } from "@/lib/productImages"
import StarRating from "../StarRating"

type Props = {
  product: ProductDetails
}

type SellerInfo = {
  id: string
  name: string
  slug?: string
}

export default function ProductDetail({ product }: Props) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)
  const image = getProductImage(product)
  const seller = (product as any).seller as SellerInfo | undefined

  const installments = calculeCartInstallments([{
    price: product.price,
    quantity: 1,
    max_installments: product.max_installments,
    free_installments: product.free_installments,
    min_installment_amount: product.min_installment_amount,
    monthly_interest_rate: product.monthly_interest_rate,
  }])

  const best = installments.at(-1) ?? {
    installment_amount: product.price,
    installments: 1,
  }

  const { units, cents } = splitPrice(best.installment_amount)
  const genres = product.genre?.join(", ") || "—"
  const mediaType = product.type?.[0] || "—"
  const sellerName = seller?.name ?? product.sellerId
  const sellerProfileUrl = seller?.id && seller?.slug ? `/profile/${seller.id}/${seller.slug}` : undefined

  return (
    <View className="flex-1 bg-stone-100">
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row items-center px-4 py-3 bg-primary"
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-chakra text-lg flex-1" numberOfLines={1}>
          {product.name}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="w-full aspect-square bg-white items-center justify-center">
          <Image
            source={image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-row items-center py-2.5 px-2 bg-stone-100">
          <TouchableOpacity
            className="px-1"
            onPress={() => setActiveSlide((p) => Math.max(0, p - 1))}
          >
            <Text className="text-lg font-semibold text-stone-500">{"<"}</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row items-center gap-x-1.5 px-1"
          >
            {[0].map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveSlide(i)}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 ${
                  i === activeSlide ? "border-red-700" : "border-transparent"
                }`}
              >
                <Image source={image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            className="px-1"
            onPress={() => setActiveSlide((p) => Math.min(0, p + 1))}
          >
            <Text className="text-lg font-semibold text-stone-500">{">"}</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-3 pb-2">
          <Text style={styles.title}>{product.name}</Text>

          <View className="flex-row items-center gap-2 my-2">
            <StarRating rating={product.rating} />
            <Text className="text-sm text-stone-500">({product.rating.toFixed(1)})</Text>
          </View>

          <Text className="text-sm text-stone-600 mb-1">
            Por{" "}
            {sellerProfileUrl ? (
              <Link href={sellerProfileUrl} className="text-primary font-semibold" asChild>
                <Text>{sellerName}</Text>
              </Link>
            ) : (
              <Text className="text-primary font-semibold">{sellerName}</Text>
            )}
          </Text>

          <View className="flex-row flex-wrap gap-x-4 gap-y-1 mb-3">
            <Text className="text-sm text-stone-600">
              <Text className="font-semibold">Tipo:</Text> {mediaType}
            </Text>
            <Text className="text-sm text-stone-600">
              <Text className="font-semibold">Gênero:</Text> {genres}
            </Text>
            {product.amount != null && (
              <Text className="text-sm text-stone-600">
                <Text className="font-semibold">Estoque:</Text> {product.amount} un.
              </Text>
            )}
          </View>

          {product.description && (
            <Text className="text-[13px] leading-[19px] text-stone-500">
              {product.description}
            </Text>
          )}
        </View>

        <View className="px-4 py-2">
          <Text style={styles.price}>R$ {formatPrice(product.price)}</Text>
          <Text className="text-sm text-stone-500">
            em até {best.installments}x de R$ {units},{cents}
          </Text>
        </View>

        <View className="flex-row items-center gap-x-3 px-4 py-4">
          <Link
            href={`/checkout/${product.id}`}
            asChild
          >
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-1 bg-third rounded-lg py-3.5 items-center justify-center"
            >
              <Text className="text-sm font-extrabold text-stone-900 tracking-widest">
                COMPRAR AGORA
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            activeOpacity={0.85}
            className="w-[52px] h-[52px] bg-third rounded-lg items-center justify-center"
          >
            <MaterialCommunityIcons name="cart-plus" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="h-px bg-stone-200 mx-4 mb-4" />

        <View className="px-4">
          <Text className="text-[15px] font-bold text-stone-900 mb-3">
            Avaliações
          </Text>
          <Text className="text-sm text-stone-500">Sem avaliações ainda.</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Chackra-Bold",
    fontSize: 20,
    color: "#1c1917",
  },
  price: {
    fontFamily: "Chackra-Bold",
    fontSize: 24,
    color: "#1c1917",
  },
})
