import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar style="auto" />
      <Text className='text-green-700 font-bold'>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}