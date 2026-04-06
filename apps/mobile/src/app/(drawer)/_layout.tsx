import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Dimensions } from 'react-native';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerPosition: 'right',
          drawerType: 'front',
          drawerStyle: {
            width: Dimensions.get('window').width * 0.75,
          },
          overlayColor: 'rgba(0,0,0,0.5)',
          headerShown: false,
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
        <Drawer.Screen name="cart" options={{ headerShown: false }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}