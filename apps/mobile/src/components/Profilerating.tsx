import { View, Text, Image, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ProfileratingProps {
  username?: string;
  productRef?: string;
  reviewText?: string;
  imageUri?: string;
  likes?: number;
  dislikes?: number;
}

export default function Profilerating({
  username = "Luiz6776",
  productRef = "Prod.: Morra luiz. VOL. 67...",
  reviewText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
  imageUri = "https://m.media-amazon.com/images/I/51Qvs9i5a%2BL._AC_.jpg",
  likes = 1,
  dislikes = 1,
}: ProfileratingProps) {
  return (
    <View className="bg-[#CCCCCC] rounded-xl mx-4 mb-3 p-3 border border-gray-200">
      <View className="flex-row items-start">
        <Image
          source={{ uri: imageUri }}
          style={{ width: 60, height: 60, borderRadius: 100 }}
        />
        <View className="flex-1 ml-2">
          <View className="flex-row justify-between">
            <Text style={{ fontSize: 11, fontWeight: "bold", color: "#000" }}>
              {username}{" "}
              <Text style={{ fontSize: 9, color: "#333" }}>• Há 5 dias</Text>
            </Text>
            <Text style={{ fontSize: 9, color: "#333" }} numberOfLines={1}>
              {productRef}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: "#222", marginTop: 4 }} numberOfLines={6}>
            {reviewText}
          </Text>
        </View>
      </View>
      <View className="flex-row mt-2 gap-3">
        <TouchableOpacity className="flex-row items-center gap-1">
          <AntDesign name="like" size={16} color="#555" />
          <Text style={{ fontSize: 12, color: "#555" }}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center gap-1">
          <AntDesign name="dislike" size={16} color="#555" />
          <Text style={{ fontSize: 12, color: "#555" }}>{dislikes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}