import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ProductDetails, formatPrice, getProductUrl } from "@retrovault/core";
import { getProductById } from "@/services/product.service";
import { getProductImage } from "@/lib/productImages";

export default function CheckoutPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getProductById(id).then((found) => {
      setProduct(found ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BF372A" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Produto não encontrado.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const image = getProductImage(product);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Stack.Screen options={{ headerShown: true }} />
        <Text style={styles.title}>Checkout</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>R$ {formatPrice(product.price)}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(getProductUrl(product))}
      >
        <Text style={styles.buttonText}>Voltar ao produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: "#4b5563",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#BF372A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
  },
});
