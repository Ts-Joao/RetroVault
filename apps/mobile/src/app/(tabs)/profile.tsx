import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Profileproduct from '../../components/Profileproduct';

export default function Home() {
  return (
    <View className="flex bg-white">
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
      <Profileproduct />
      <Profileproduct />
    </View>
  );
}