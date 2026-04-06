import { View, TextInput, Image } from "react-native";
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
    const insets = useSafeAreaInsets()

    return (
        <View style={{ paddingTop: insets.top }} className="flex flex-row items-center text-[#374151] bg-primary py-3 justify-around">
            <Image source={require('../../assets/image/logo.png')} style={{width: 80, height: 40}} resizeMode="contain" />
            <View className="flex flex-row bg-background-light w-55 max-w-60 py-2 px-3 rounded-lg items-center">
                <TextInput placeholder="O que deseja hoje? " className="placeholder:text-slate-800"/>
                <Octicons name="search" size={18} />
            </View>
            <MaterialCommunityIcons name="cart-outline" size={24} color='#ffffff' />
        </View>
    )
}