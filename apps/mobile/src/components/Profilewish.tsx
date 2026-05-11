import { View, Text, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface ProfilewishProps {
  title?: string;
  orderId?: string;
  seller?: string;
  price?: string;
  imageUri?: string;
  onRemove?: () => void;
  onBuy?: () => void;
}

export default function Profilewish({
  title = "Morra luiz. Vol. 67...",
  orderId = "N°: 885.",
  seller = "Vendedor: codestudio",
  price = "R$67,76",
  imageUri = "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg",
  onRemove,
  onBuy,
}: ProfilewishProps) {
  return (
    <View className="bg-[#CCCCCC] rounded-xl flex-row items-stretch mx-4 mb-3 overflow-hidden border border-gray-200">
      <View className="justify-center">
      <Image
        source={{ uri: imageUri }}
        className="w-16 h-16 rounded-xl ml-2"
      />
      </View>
      <View className="flex-1 px-3 py-2 justify-center">
        <Text className="font-bold text-black text-sm" numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{orderId}</Text>
        <Text style={{ fontSize: 9, color: "#555" }}>{seller}</Text>
        <Text className="font-bold text-black text-sm mt-1">
          {price} <Text className="font-normal text-xs">no Pix</Text>
        </Text>
      </View>
      <View className="items-end justify-between py-2 px-2">
        <TouchableOpacity onPress={onRemove}>
          <Feather name="trash" size={22} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onBuy}
          className="rounded-md px-3 py-1"
          style={{ backgroundColor: "#FFA500" }}
        >
          <Text className="text-white font-bold text-xs tracking-widest">COMPRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}