import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import { StatusBar } from 'expo-status-bar';
import ProductGrid from '@/components/Product/ProductGrid';

export default function Home() {
  const recentlySeen = true
  
  return (
    <ScreenContainer>
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
      <View className='flex gap-2' style={{ marginInline: 'auto' }}>
        <View style={styles.container}>
          <Text style={styles.title}>Recomendações</Text>
          <MaterialCommunityIcons name="filter-outline" size={20} color="black" />
        </View>
        <ProductGrid />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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