import { 
    View, 
    TextInput,
    StyleSheet,
    Image } 
from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Login() {

    

    return (
        <View style={styles.container}>
            <View style={styles.containerLogin}>
                <Image 
                    source={require('../../../../assets/image/logo.png')}
                    style={{ width: 170, height: 100 }
                }
                />
            </View>
            
            <FontAwesome name="user-o" size={24} color="black" />
            <TextInput placeholder="E-mail"></TextInput>

            <TextInput placeholder="password"></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        margin: 'auto',
        backgroundColor: '#fdf6ef',
        height: 800,
        width: 350
    },
    containerLogin: {

    }
})