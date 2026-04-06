import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import '../globals.css';

export default function RootLayout() {
  const colorSchema = useColorScheme()

  return (
    <SafeAreaProvider>
      <View className={`flex-1 ${colorSchema === 'dark' ? 'dark' : ''}`}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}