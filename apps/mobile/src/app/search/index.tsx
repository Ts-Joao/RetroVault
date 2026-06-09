import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function SearchScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();

  return (
    <View>
      <Text>Resultados para: {query}</Text>
      
    </View>
  );
}