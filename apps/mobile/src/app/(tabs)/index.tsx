import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <View className="flex-1 bg-white px-8 py-5">
      <StatusBar style="auto" />
      <View className='flex gap-5'>
        <View style={styles.text}>
          <Text className='font-chakra font-bold text-md'>Recomendações</Text>
          <MaterialCommunityIcons name="filter-menu-outline" size={24} color="black" />
        </View>
        <View style={styles.grid}>
          <View style={styles.item}><Text>1</Text></View>
          <View style={styles.item}><Text>2</Text></View>
          <View style={styles.item}><Text>3</Text></View>
          <View style={styles.item}><Text>4</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10
  },
  item: {
    backgroundColor: '#d9d9d9',
    width: '30%', 
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  }
})