import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import { StatusBar } from 'expo-status-bar';
import ProductGrid from '@/components/Product/ProductGrid';
import { useState } from 'react';
import FilterSheet from '@/components/FilterSheet';
import { useFilters } from '@retrovault/ui-hooks';

export default function Home() {
  const [recentlySeen, setRecentlySeen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const { updateFilter, filters, activeCount, resetFilters } = useFilters()
  
  return (
    <ScreenContainer>
      <StatusBar style="auto" />

      {/* Banner */}
      <View style={{height: 150, backgroundColor: '#43464B', borderRadius: 8, marginBottom: 20}}></View>

      {/* Recently Seen */}
      { recentlySeen == true ? (
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
          <MaterialCommunityIcons name="filter-outline" size={28} color="black" onPress={() => setFilterModalOpen(!filterModalOpen)} />
            {filterModalOpen ? (
              <View className='absolute h-20 w-10'>
                <FilterSheet filters={filters} onChange={updateFilter} onClose={() => setFilterModalOpen(false)} visible={filterModalOpen} onReset={resetFilters} />
              </View>
            ) : ''}
        </View>
        <ProductGrid />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative',
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
    fontFamily: 'Chackra-Bold',
    fontSize: 24,
  }
})