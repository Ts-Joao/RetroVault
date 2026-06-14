import ProductCard from "./ProductCard";
import { StyleSheet, View } from "react-native";
import { getProducts } from "@/services/product.service";
import { useEffect, useState } from "react";
import { Product } from "@retrovault/core";

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        getProducts().then(setProducts)
    }, [])
    
    return (
    <View style={styles.grid}>
        {products.map((product) => (
            <View key={product.id} className="w-[48%]">
                <ProductCard product={product} />
            </View>
        ))}
    </View>
    );
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