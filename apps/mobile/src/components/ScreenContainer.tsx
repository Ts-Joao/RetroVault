import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreenContainer({ children }: {children: React.ReactNode}) {
    const insets = useSafeAreaInsets()
    
    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 20, gap: 20, paddingBottom: 80 + insets.bottom }}
        >
            {children}
        </ScrollView>
    )
}