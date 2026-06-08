import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();

  return (
    <View>
      <Text>Resultados para: {q}</Text>
      {/* renderize os resultados filtrados por `q` */}
    </View>
  );
}