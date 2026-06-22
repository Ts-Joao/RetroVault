import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { Product } from "@retrovault/core";
import ScreenContainer from "@/components/ScreenContainer";
import ProductCard from "@/components/Product/ProductCard";
import { searchProducts } from "@/services/product.service";
import { StatusBar } from "expo-status-bar";

export default function SearchScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim() === "") {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    searchProducts(query.trim())
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("Não foi possível conectar ao servidor. Tente novamente.");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <ScreenContainer>
      <StatusBar style="auto" />

      {/* Cabeçalho da busca */}
      <View style={styles.headerRow}>
        <Octicons name="search" size={20} color="#BF372A" />
        <Text style={styles.queryLabel} numberOfLines={1}>
          {query ? `"${query}"` : "Busca"}
        </Text>
        {!loading && !error && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{products.length}</Text>
          </View>
        )}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#BF372A" />
          <Text style={styles.loadingText}>Buscando produtos...</Text>
        </View>
      )}

      {/* Erro de conexão */}
      {!loading && error && (
        <View style={styles.centered}>
          <Octicons name="alert" size={48} color="#BF372A" />
          <Text style={styles.emptyTitle}>Erro de conexão</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      )}

      {/* Sem resultados */}
      {!loading && !error && products.length === 0 && query && (
        <View style={styles.centered}>
          <Octicons name="search" size={48} color="#d9d9d9" />
          <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Não encontramos nada para{" "}
            <Text style={styles.emptyQuery}>"{query}"</Text>.{"\n"}
            Tente outro termo.
          </Text>
        </View>
      )}

      {/* Prompt inicial (sem query) */}
      {!loading && !query && (
        <View style={styles.centered}>
          <Octicons name="search" size={48} color="#d9d9d9" />
          <Text style={styles.emptyTitle}>O que você procura?</Text>
          <Text style={styles.emptySubtitle}>
            Use a barra de busca para encontrar produtos.
          </Text>
        </View>
      )}

      {/* Grid de resultados */}
      {!loading && !error && products.length > 0 && (
        <View style={styles.grid}>
          {products.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  queryLabel: {
    flex: 1,
    fontFamily: "Chackra-Bold",
    fontSize: 20,
    color: "#1a1a1a",
  },
  countBadge: {
    backgroundColor: "#BF372A",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontFamily: "Chackra-Bold",
    color: "#fff",
    fontSize: 13,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontFamily: "Chackra",
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  emptyTitle: {
    fontFamily: "Chackra-Bold",
    fontSize: 20,
    color: "#1a1a1a",
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Chackra",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyQuery: {
    fontFamily: "Chackra-Bold",
    color: "#BF372A",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: "48%",
  },
});