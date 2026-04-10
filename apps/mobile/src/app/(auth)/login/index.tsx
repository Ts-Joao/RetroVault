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

            <View style={styles.containerEmail}>    
                <FontAwesome name="user-o" size={24} color="#e57373" />
                <TextInput
                    style={styles.email} 
                    placeholder=" E-mail "
                />
            </View>

            <View style={styles.containerPassword}>
                <TextInput
                    style={styles.password}
                    placeholder=" password " 
                />
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
        height: 800,
        width: 370,
        borderWidth: 2,
        borderRadius: 20,
        borderStyle: 'solid',
        borderColor: '#e57373'
    },
    containerLogin: {
        marginTop: 40
    },
    containerEmail: {
        marginTop: 60,
        padding: 5
    },
    containerPassword: {
        marginTop: 20
    },
    email: {
        borderWidth: 2,
        borderRadius: 9,
        borderStyle: 'solid',
        borderColor: '#e57373',
        backgroundColor: '#ffff',
        width: 300,
        height: 30,
        marginTop: 5
    },
    password: {
        borderWidth: 2,
        borderRadius: 9,
        borderStyle: 'solid',
        borderColor: '#e57373',
        backgroundColor: '#ffff',
        width: 300,
        height: 30,
        marginTop: 5
    }
})