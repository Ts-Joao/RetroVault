import { 
    View, 
    TextInput,
    StyleSheet,
    Image } 
from "react-native";

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.containerLogin}>
                <Image 
                    source={require('../../../../assets/image/logo.png')}
                    style={{ width: 170, height: 100 }}
                />
            </View>

            <TextInput placeholder="E-mail"></TextInput>

            <TextInput placeholder="password"></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        margin: 'auto'
    },
    containerLogin: {

    }
})