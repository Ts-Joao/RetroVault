import { calculeCartInstallments, formatPrice, Product, splitPrice } from "@retrovault/core"
import { Image, View, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mockUsers } from "@/services/user.service"
import StarRating from "../StarRating"
import { Link } from "expo-router"

type Prop = {
    product: Product
}

export default function ProductCard({ product }: Prop ) {
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
        <View>
            <View className="bg-white flex relative justify-center items-center h-35 w-35">
                <Image source={product.photo} className="object-contain" />
            </View>
            <Text>{product.name}</Text>
            <Text>Por <Link href={`/profile/${seller?.id}/${seller?.slug}`}>{seller?.name}</Link></Text>
            <span className="flex justify-end"><StarRating rating={product.rating}/></span>

            <View>
                <Text>R$ {formatPrice(product.price)}</Text>
                <View>
                    <Text>{product.max_installments}x</Text>
                    <Text>R$ {units}, <Text>{cents}</Text></Text>
                </View>
            </View>

            <View className="flex items-center">
                <Link href={`/checkout/${product.id}`}>
                    <Text>Compra Agora</Text>
                </Link>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="car-outline" size={28} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    )
}