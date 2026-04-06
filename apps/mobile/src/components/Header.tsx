import { View, TextInput, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Header() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    

    return (
        <View style={{ paddingTop: insets.top }} className="flex flex-row items-center text-[#374151] bg-primary py-3 justify-around">
            <Image source={require('../../assets/image/logo.png')} style={{width: 80, height: 40}} resizeMode="contain" />
            <View className="flex flex-row bg-background-light px-2 rounded-lg items-center gap-2">
                <TextInput placeholder="O que deseja hoje ?" className="py-2 px-3 min-w-48 max-w-48 placeholder:text-slate-500 text-slate-800 placeholder:font-chakra placeholder:text-md focus:outline-none" />
                <Octicons name="search" size={18} onPress={() => router.navigate('/search')} />
            </View>
            <MaterialCommunityIcons name="cart-outline" size={24} color='#fff' onPress={() => router.push('/cart')} />
        </View>
    )
}

// const styles = StyleSheet.create({
//     text_input: {
//         flex: 1,
//         fontFamily: 'Chackra',
//         color: "#d9d9d9",
//         fontSize: 20
//     },
//     container: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: '#F2EFDC',
//         alignItems: 'center',
//         maxHeight: 20,
//         borderRadius: 4
//     }
// })