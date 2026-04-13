import { View, TextInput, Image, Text, Platform } from "react-native";
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useCartStore } from "@retrovault/store";

export default function Header() {
    const [cartOpen, setCartOpen] = useState(false);
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const padding = Platform.OS === 'web' ? 10 : insets.top
    const totalItems = useCartStore((state) =>
        state.items.reduce((acc, item) => acc + item.quantity, 0)
    )

    return (
        <>
            <View style={{ paddingTop: padding }} className="flex flex-row items-center text-[#374151] bg-primary py-3 justify-around">
                <Image source={require('../../assets/image/logo.png')} style={{width: 80, height: 40}} resizeMode="contain" />
                <View className="flex flex-row bg-background-light px-2 rounded-lg items-center gap-2">
                    <TextInput placeholder="O que deseja hoje ?" className="py-2 px-3 min-w-48 max-w-48 placeholder:text-slate-500 text-slate-800 placeholder:font-chakra placeholder:text-md focus:outline-none" />
                    <Octicons name="search" size={18} onPress={() => router.navigate('/search')} />
                </View>
                <View className="relative">
                    <MaterialCommunityIcons name="cart-outline" size={28} color='#fff' onPress={() => setCartOpen(true)} />
                            {totalItems > 0 && (
                                <View className="absolute flex items-center justify-center rounded-full bg-red-400 border-2 border-white -right-2 -top-2 h-5 w-5">
                                    <Text className="text-white font-bold text-[10px] text-center include-font-padding-false textAlignVertical-center">
                                        {totalItems}
                                    </Text>
                                </View>
                            )}
                </View>
            </View>

            <CartDrawer visible={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    )
}
