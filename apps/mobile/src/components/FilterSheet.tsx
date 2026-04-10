import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { FilterState } from '@retrovault/ui-hooks'
import { useEffect, useRef } from 'react'
import { Modal, View, Text, Pressable, Animated, Dimensions, Button, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.33

type Props = {
    visible: boolean
    filters: FilterState
    onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
    onClose: () => void
    onReset: () => void
}

export default function FilterSheet({ filters, visible, onChange, onClose, onReset }: Props) {
    const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current
    const insets = useSafeAreaInsets()

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : DRAWER_HEIGHT,
            duration: 280,
            useNativeDriver: true,
        }).start()
    }, [visible])

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent animationType="none">
            {/* overlay */}
            <Pressable
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                onPress={onClose}
            />

            {/* sheet */}
            <Animated.View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: DRAWER_HEIGHT,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    paddingBottom: insets.bottom,
                    transform: [{ translateY }],
                }}
            >
                <View style={{ padding: 16, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filtros</Text>
                        <View style={{ height: 28, width: 28, backgroundColor: '#FFCDD2', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome6 name="x" size={10} color="#B20000" onPress={() =>onClose()}/>
                        </View>
                    </View>

                    <Pressable onPress={() => onChange('condition', 'used')}>
                        <Text>Usado</Text>
                    </Pressable>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => onReset()} style={styles.input}>
                            <Text>Limpar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={styles.input}>
                            <MaterialCommunityIcons name="tune-variant" size={24} color="black" />
                            <Text>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    input: {
        width: '49%',
        height: 40,
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    input_filter: {
        backgroundColor: '#B20000'
    }
})