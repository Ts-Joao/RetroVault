import ProductCard from "./ProductCard";
import { StyleSheet, View } from "react-native";
import { getProducts } from "@/services/product.service";

export default async function ProductGrid() {
    const products = await getProducts()
    
    return (
    <View style={styles.grid}>
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
    </View>
    );
    }

    const styles = StyleSheet.create({
    grid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    }
})