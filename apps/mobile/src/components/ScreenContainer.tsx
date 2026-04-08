import { ScrollView } from "react-native";

export default function ScreenContainer({ children }: {children: React.ReactNode}) {
    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 20, gap: 20 }}
        >
            {children}
        </ScrollView>
    )
}