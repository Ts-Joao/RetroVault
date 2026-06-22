import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import CartItemCard, { CartItem } from "@/components/ProductWish";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const { favorites, loading, fetchFavorites, toggleFavorite } = useFavoritesStore();

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchFavorites();
      }
    }, [token])
  );

  if (!token) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <StatusBar style="auto" />
        <Text className="text-lg font-barlow text-center text-gray-500">
          Faça login para ver seus favoritos.
        </Text>
      </View>
    );
  }

  if (loading && favorites.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <StatusBar style="auto" />
        <ActivityIndicator size="large" color="#BF372A" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <StatusBar style="auto" />
        <Text className="text-lg font-barlow text-center text-gray-500">
          Nenhum produto favoritado ainda.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-4 px-4">
      <StatusBar style="auto" />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        renderItem={({ item }) => {
          const product = item.product;
          const cartItem: CartItem = {
            id: product.id,
            title: product.name,
            number: product.slug,
            seller: (product as any).seller?.name ?? "RetroVault",
            price: Number(product.price),
            coverUri: product.photos?.[0]?.url,
          };

          return (
            <CartItemCard
              item={cartItem}
              onRemove={() => toggleFavorite(product)}
              onBuy={() => {
                console.log("Comprar:", product.id);
              }}
            />
          );
        }}
      />
    </View>
  );
}
