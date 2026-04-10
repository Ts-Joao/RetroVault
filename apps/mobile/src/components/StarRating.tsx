import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";

interface StarRatingProps {
    rating: number;
    color?: string;
}

export default function StarRating({ rating, color = 'text-prim' }: StarRatingProps) {
    return (
        <Text className="flex">
            {[1, 2, 3, 4, 5].map((i) => {
                if (rating >= i) {
                    return <MaterialCommunityIcons name="star" key={i} color='#BF372A' />
                } else if (rating >= i - 0.5) {
                    return <MaterialCommunityIcons name="star-half-full" key={i} color="#BF372A" />
                } else {
                    return <MaterialCommunityIcons name="star-outline" key={i} color="#BF372A" />
                }
            })}
        </Text>
    )
}