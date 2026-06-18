import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import CartItemCard, { CartItem } from "@/components/ProductWish";

export default function Home() {
  return (
    <View className="flex-1 bg-white items-center gap-y-4 pt-4">
      <StatusBar style="auto" />
      <CartItemCard
        item={{
          id: "3",
          title: "Morra luiz. Vol. 67...",
          number: "885",
          seller: "codestudio",
          price: 67.76,
          coverUri: "https://...",
        }}
        onRemove={(id) => removeFromCart(id)}
        onBuy={(id) => goToCheckout(id)}
      />
      
    </View>
  );
}
