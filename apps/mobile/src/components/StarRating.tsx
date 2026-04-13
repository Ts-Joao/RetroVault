import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";

interface StarRatingProps {
    rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
    return (
        <Text className="flex">
            {[1, 2, 3, 4, 5].map((i) => {
                if (rating >= i) {
                    return <MaterialCommunityIcons name="star" key={i} size={16} color='#BF372A' />
                } else if (rating >= i - 0.5) {
                    return <MaterialCommunityIcons name="star-half-full" key={i} size={16} color="#BF372A" />
                } else {
                    return <MaterialCommunityIcons name="star-outline" key={i} size={16} color="#BF372A" />
                }
            })}
        </Text>
    )
}