import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-white">
      <View className="h-40 bg-gray-300" />
      <View className="px-4 -mt-10 flex-row items-center">
        <View className="w-20 h-20 bg-red-400 rounded-full" />
        <View className="ml-4">
          <Text className="font-bold text-black">
            Luiza_melo320349
          </Text>
          <Text className="text-black">Compras: 13</Text>
        </View>
      </View>
      <View className="flex-row justify-around mt-6 border-b border-gray-400 pb-2">
        {["Produtos", "Pedidos", "Wishlist", "Avaliações"].map((item, index) => (
          <TouchableOpacity key={index}>
            <Text
              className={`text-black ${
                item === "Pedidos" ? "border-b-2 border-black pb-1" : ""
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="px-4 mt-4">
        <View className="bg-green-300 rounded-xl p-3 flex-row items-center">
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
              <Text>⭐</Text>
              <Text className="ml-1">4,5</Text>
            </View>

            <Text className="font-bold mt-1">R$20,90</Text>
          </View>
          <Text className="text-blue-500 font-medium">
            A caminho
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}