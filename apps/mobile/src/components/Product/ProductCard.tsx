import { calculeCartInstallments, formatPrice, Product, splitPrice } from "@retrovault/core"
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { mockUsers } from "@/services/user.service"
import { useCartStore } from '@retrovault/store'
import StarRating from "../StarRating"
import { Link } from "expo-router"

type Prop = {
    product: Product
}

export default function ProductCard({ product }: Prop) {
    const addItem = useCartStore(state => state.addItem)
    const seller = mockUsers.find(user => user.id === product.seller_id)

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

    return (
        <View className="p-2 bg-[#d9d9d9] rounded-2xl flex-1">

            <View className="bg-white justify-center items-center rounded-t-xl overflow-hidden" style={{ aspectRatio: 1 }}>
                <Image
                    source={product.photo as any}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title} numberOfLines={2}>
                {product.name}
            </Text>

            <Text className="text-2xl font-barlow">
                Por{' '}
                <Link href={`/profile/${seller?.id}/${seller?.slug}`} className="text-md">
                    {seller?.name}
                </Link>
            </Text>

            <View className="flex-row justify-end">
                <StarRating rating={product.rating} />
            </View>

            <View className="flex justify-between items-end translate-y-1 mt-[-0.5rem]">
                <View className="flex-row gap-1 items-baseline">
                    <Text style={styles.installment_amount}>{product.max_installments}x</Text>
                    <Text className="text-md font-chakra">R$ {units},<Text className="text-[10px]">{cents}</Text></Text>
                </View>
            </View>
            <Text style={styles.price}>R$ {formatPrice(product.price)}</Text>

            <View className="flex-row items-center justify-center gap-1">
                <Link
                    href={`/checkout/${product.id}`}
                    className="bg-third rounded-md px-3 py-1 flex-1 text-center text-md"
                >
                    Compra Agora
                </Link>
                <TouchableOpacity className="bg-third p-1 rounded-md" onPress={() => addItem(product)}>
                    <MaterialCommunityIcons name="cart-plus" size={15} color="#000" />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Chackra-Bold',
        fontSize: 20,
    },
    price: {
        fontFamily: 'Chackra-Bold',
        fontSize: 22,
    },
    installment_amount: {
        fontFamily: 'Chackra-Bold',
        fontSize: 18
    }
})