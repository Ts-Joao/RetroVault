import { FilterState } from '@retrovault/ui-hooks'
import { useEffect, useRef } from 'react'
import { Modal, View, Text, Pressable, Animated, Dimensions } from 'react-native'
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
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filtros</Text>

                    <Pressable onPress={() => onChange('condition', 'used')}>
                        <Text>Usado</Text>
                    </Pressable>

                    <Pressable onPress={onReset}>
                        <Text>Limpar Filtros</Text>
                    </Pressable>

                    <Pressable onPress={onClose}>
                        <Text>Aplicar Filtros</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </Modal>
    )
}