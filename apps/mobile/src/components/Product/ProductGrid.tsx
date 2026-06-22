import ProductCard from "./ProductCard";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { getProducts } from "@/services/product.service";
import { useEffect, useState } from "react";
import { Product } from "@retrovault/core";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#BF372A" />
      </View>
    )
  }

  return (
    <View style={styles.grid}>
      {products.map((product) => (
        <View key={product.id} className="w-[48%]">
          <ProductCard product={product} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
    grid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingInline: 8
    }
})