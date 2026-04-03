import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className='text-rose-700 font-bold'>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}