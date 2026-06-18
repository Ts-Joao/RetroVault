import { View, Text, Image, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ProfileproductProps {
  title?: string;
  orderId?: string;
  deliveryDate?: string;
  price?: string;
  status?: string;
  imageUri?: string;
  onRemove?: () => void;
}

export default function Profileproduct({
  title = "Morra luiz. Vol. 67...",
  orderId = "Nºpedido: 97876782",
  deliveryDate = "Entrega prevista: 08/27",
  price = "R$67,76",
  status = "A caminho",
  imageUri = "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg",
  onRemove,
}: ProfileproductProps) {
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
        <Text style={{ fontSize: 9, color: "#555" }}>{deliveryDate}</Text>
        <Text className="font-bold text-black text-sm mt-1">
          {price} <Text className="font-normal text-xs">no Pix</Text>
        </Text>
      </View>
      <View className="items-end justify-between py-2 px-2">
        <Text className="text-green-700 font-semibold text-sm">{status}</Text>
        <TouchableOpacity onPress={onRemove}>
          <AntDesign name="close-circle" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}