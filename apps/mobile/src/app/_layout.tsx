
import { ChakraPetch_400Regular, ChakraPetch_700Bold, useFonts } from '@expo-google-fonts/chakra-petch';
import { BarlowCondensed_400Regular } from '@expo-google-fonts/barlow-condensed';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, useColorScheme } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar'
import './globals.css';

SplashScreen.preventAutoHideAsync()
SystemUI.setBackgroundColorAsync('#000000')

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Chackra': ChakraPetch_400Regular,
    'Chackra-Bold': ChakraPetch_700Bold,
    'Elite': SpecialElite_400Regular,
    'Barlow': BarlowCondensed_400Regular
  })

  const colorSchema = useColorScheme()

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden')
  }, [])

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }
  
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: 'black' }} className={colorSchema === 'dark' ? 'dark' : ''}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}