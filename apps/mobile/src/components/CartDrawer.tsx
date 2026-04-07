import { useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '@retrovault/store';
import { CartItem } from '@retrovault/core';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CartDrawer({ visible, onClose }: Props) {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const { items, increment, decrement, total } = useCartStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : DRAWER_WIDTH,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray-100">
      <Image
        source={{ uri: item.product.photo }}
        style={{ width: 64, height: 64, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text className="text-sm text-primary font-bold mt-1">
          R$ {(item.product.price * item.quantity).toFixed(2)}
        </Text>
        <View className="flex-row items-center gap-2 mt-2">
          <TouchableOpacity
            onPress={() => decrement(item.product.id)}
            className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center"
          >
            <Feather name="minus" size={12} color="#374151" />
          </TouchableOpacity>
          <Text className="text-sm font-medium text-gray-700 w-4 text-center">
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => increment(item.product.id)}
            className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center"
          >
            <Feather name="plus" size={12} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Overlay */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Drawer */}
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          backgroundColor: '#fff',
          transform: [{ translateX }],
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View className="flex-1 px-4">
          <Text className="text-lg font-bold text-gray-800 py-4">Carrinho</Text>

          {items.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-2">
              <Feather name="shopping-cart" size={40} color="#9ca3af" />
              <Text className="text-gray-400 text-sm">Seu carrinho está vazio</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={items}
                keyExtractor={(item) => item.product.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
              <View className="border-t border-gray-200 pt-4 gap-3 pb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">Total</Text>
                  <Text className="text-primary font-bold text-lg">
                    R$ {total().toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity className="bg-primary py-3 rounded-xl items-center">
                  <Text className="text-white font-semibold text-sm">Finalizar compra</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}