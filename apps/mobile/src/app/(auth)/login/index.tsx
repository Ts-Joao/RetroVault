import { 
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity, } 
from "react-native";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const clickPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerLogin}>
                <Image
                    source={require('../../../../assets/image/logo.png')}
                    style={{ width: 170, height: 100 }
                }
                />
            </View>

            <Text style={styles.title}>
                Bem-vindo
            </Text>

            <View style={styles.inputContainer}>    
                <FontAwesome name="user-o" size={24} color="#e57373" />
                <TextInput
                    style={styles.input} 
                    placeholder="E-mail"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#e57373" />
                <TextInput
                    style={styles.input}
                    placeholder=" password "
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={clickPassword} style={styles.eyeIcon}>
                    <FontAwesome 
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={24}
                        color="#e57373"
                    />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.link}>
                <FontAwesome6 name="arrow-right" size={16} color="#e57373" />
                <Text style={styles.text}>Criar uma </Text>
                <Text style={[styles.text, { color: '#e57373' }]}>conta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
            >
                <Text style={styles.continue}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.divideContainer}>
                <View style={styles.divide} />
                <View style={styles.divideText}>Login com</View>
                <View style={styles.divide} />
            </View>

            <View style={styles.mediaSocial}>
                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="google" size={32} color="#d4a373" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="facebook" size={32} color="#d4a373" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        margin: 'auto',
        backgroundColor: '#fdf6ef',
        height: 650,
        width: 370,
        borderWidth: 3,
        borderRadius: 20,
        borderStyle: 'solid',
        borderColor: '#e57373'
    },
    containerLogin: {
        marginTop: 30,
        marginBottom: 20
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 30,
        textDecorationLine: 'underline',
        textDecorationColor: '#e57373',
        textDecorationStyle: 'solid' 
    },
    error: {
        color: '#e57373', 
        fontSize: 12,
        marginBottom: 12,
        marginRight: 20,
        marginLeft: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingLeft: 15,
        width: '90%',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#e57373',
        backgroundColor: '#fff',
        height: 50
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#000'
    },
    eyeIcon: {
        paddingRight: 15,
        paddingLeft: 10
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
        paddingLeft: 15
    },
    text: {
        fontSize: 16,
        color: '#000',
        marginLeft: 8
    },
    button: {
        backgroundColor: '#c45555',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 15,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5
    },
    continue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
    divideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        width: '90%'
    },
    divide: {
        flex: 1,
        height: 1,
        backgroundColor: '#e57373'
    },
    divideText: {
       marginHorizontal: 10,
        color: '#e57373',
        fontSize: 14,
        fontWeight: '500' 
    },
    mediaSocial: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%'
    },
    socialButton: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: 'rgba(212, 163, 115, 0.1)',
        alignItems: 'center',
        justifyContent: 'center'
    }
})