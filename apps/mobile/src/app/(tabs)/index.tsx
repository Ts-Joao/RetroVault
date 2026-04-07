import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const recentlySeen = true
  
  return (
    <View className="flex-1 bg-white px-8 py-5 gap-10">
      <StatusBar style="auto" />

      {/* Banner */}
      <View style={{height: 150, backgroundColor: '#43464B', borderRadius: 8, marginBottom: 20}}></View>

      {/* Recently Seen */}
      { recentlySeen ? (
        <View className='gap-2'>
          <Text style={styles.title}>Visto Recemente</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} >
            <View style={styles.carouselItem}><Text>1</Text></View>
            <View style={styles.carouselItem}><Text>2</Text></View>
            <View style={styles.carouselItem}><Text>3</Text></View>
            <View style={styles.carouselItem}><Text>4</Text></View>
          </ScrollView>
        </View>
      ) : '' }

      {/* Trending */}
      <View>
        <Text style={styles.title}>Em Alta</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} >
            <View style={styles.carouselItem}><Text>1</Text></View>
            <View style={styles.carouselItem}><Text>2</Text></View>
            <View style={styles.carouselItem}><Text>3</Text></View>
            <View style={styles.carouselItem}><Text>4</Text></View>
          </ScrollView>
      </View>

      {/* Grid-Products */}
      <View className='flex gap-2'>
        <View style={styles.container}>
          <Text style={styles.title}>Recomendações</Text>
          <MaterialCommunityIcons name="filter-outline" size={20} color="black" />
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
  container: {
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
    borderRadius: 8
  },
  carousel: {
    flexDirection: 'row',
    gap: 10
  },
  carouselItem: {
    backgroundColor: '#d9d9d9',
    width: 111,
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Chackra',
    fontSize: 14,
    fontWeight: 'bold'
  }
})