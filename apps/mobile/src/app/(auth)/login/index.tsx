import { View, 
        Text, 
        TextInput, 
        Button, 
        Image } 
    from "react-native";

export default function Login() {
    return (
        <view>
            <view>
                <Image 
                source={require('../../../../assets/image/logo.png')}
                style={{ width: 170, height: 100 }}
                />
            </view>

            <Text>
                Bem Vindo
            </Text>
        </view>
    );
}