import { View, Text, Image, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Profileproduct() {
  return (
    <ScrollView className="px-4 mt-4">
      <View className="bg-[#D7BDBD] rounded-xl border-2 border-[#C0A0A0] p-3 flex-row items-center">
        <Image
          source={{
            uri: "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg",
          }}
          className="w-16 h-20 rounded-md"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-black">
            Senhor dos aneis: sociedade do anel
          </Text>

          <View className="flex-row items-center mt-1">
            <Text>
              <AntDesign name="star" size={14} color="yellow" />
            </Text>
            <Text className="ml-1">4,5</Text>
          </View>

          <Text className="font-bold mt-1">R$20,90</Text>
        </View>
        <View className="bg-blue-200 flex h-full justify-center border-l-2 border-blue-300">
          <Text className="text-blue-500 font-medium">A caminho</Text>
        </View>
      </View>
    </ScrollView>
  );
}
