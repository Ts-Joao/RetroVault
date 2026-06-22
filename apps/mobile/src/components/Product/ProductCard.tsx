import {
  formatPrice,
  getProductInstallments,
  getProductUrl,
  getBestProductInstallment,
  Product,
  splitPrice,
} from "@retrovault/core";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCartActionsStore } from "../../stores/useCartActionsStore";
import StarRating from "../StarRating";
import { Link } from "expo-router";
import { getProductImage } from "@/lib/productImages";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useAuthStore } from "../../stores/useAuthStore";

type SellerInfo = {
  id: string;
  name: string;
  slug?: string;
};

type Prop = {
  product: Product;
};

export default function ProductCard({ product }: Prop) {
  const addItem = useCartActionsStore((state) => state.addItem);
  const seller = (product as any).seller as SellerInfo | undefined;
  const productUrl = getProductUrl(product);

  const installments = getProductInstallments(product);
  const best = getBestProductInstallment(product);
  const { units, cents } = splitPrice(best.installment_amount);

  const sellerName = seller?.name ?? product.sellerId;
  const sellerProfileUrl =
    seller?.id && seller?.slug
      ? `/profile/${seller.id}/${seller.slug}`
      : undefined;

  const token = useAuthStore((state) => state.token);
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const isFavorited = favorites.some((f) => f.productId === product.id);

  const handleFavoritePress = () => {
    if (!token) {
      Alert.alert(
        "Acesso restrito",
        "Você precisa fazer login para favoritar produtos."
      );
      return;
    }
    toggleFavorite(product);
  };

  return (
    <View className="p-2 bg-[#d9d9d9] rounded-2xl flex-1">
      <View style={{ position: "relative" }}>
        <Link href={productUrl} asChild>
          <Pressable
            className="bg-white justify-center items-center rounded-t-xl overflow-hidden"
            style={{ aspectRatio: 1 }}
          >
            <Image
              source={getProductImage(product)}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </Pressable>
        </Link>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleFavoritePress}
        >
          <MaterialCommunityIcons
            name={isFavorited ? "heart" : "heart-outline"}
            size={20}
            color={isFavorited ? "#BF372A" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <Link href={productUrl} asChild>
        <Pressable>
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
        </Pressable>
      </Link>

      <Text className="text-2xl font-barlow">
        Por{" "}
        {sellerProfileUrl ? (
          <Link href={sellerProfileUrl} asChild>
            <Text className="text-md">{sellerName}</Text>
          </Link>
        ) : (
          <Text className="text-md">{sellerName}</Text>
        )}
      </Text>

      <View className="flex-row justify-end">
        <StarRating rating={product.rating} />
      </View>

      <View className="flex justify-between items-end translate-y-1 mt-[-0.5rem]">
        <View className="flex-row gap-1 items-baseline">
          <Text style={styles.installment_amount}>
            {product.max_installments}x
          </Text>
          <Text className="text-md font-chakra">
            R$ {units},<Text className="text-[10px]">{cents}</Text>
          </Text>
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
        <TouchableOpacity
          className="bg-third p-1 rounded-md"
          onPress={() => addItem(product.id)}
        >
          <MaterialCommunityIcons name="cart-plus" size={15} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Chackra-Bold",
    fontSize: 20,
  },
  price: {
    fontFamily: "Chackra-Bold",
    fontSize: 22,
  },
  installment_amount: {
    fontFamily: "Chackra-Bold",
    fontSize: 18,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
