import { View, useColorScheme } from 'react-native';
import Header from '../components/Header';
import { Stack } from 'expo-router';
import '../globals.css';

export default function RootLayout() {
  const colorSchema = useColorScheme()

  return (
    <View className={`flex-1 ${colorSchema === 'dark' ? 'dark' : ''}`}>
      <Stack
        screenOptions={{
          header: () => <Header />,
          headerTransparent: false
        }}
      />
    </View>
  );
}