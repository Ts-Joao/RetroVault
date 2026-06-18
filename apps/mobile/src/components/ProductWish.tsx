import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export type CartItem = {
  id: string;
  title: string;
  number: string;
  seller: string;
  price: number;
  coverUri?: string;
};

type Props = {
  item: CartItem;
  onRemove?: (id: string) => void;
  onBuy?: (id: string) => void;
};

export default function CartItemCard({ item, onRemove, onBuy }: Props) {
  const handleRemove = () => {
    Alert.alert("Remover item", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => onRemove?.(item.id),
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Cover */}
      <View style={styles.coverWrap}>
        {item.coverUri ? (
          <Image source={{ uri: item.coverUri }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverFallback]}>
            <Text style={styles.coverFallbackText}>
              {item.title.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.meta}>N°: {item.number}</Text>
        <Text style={styles.meta}>Vendedor: {item.seller}</Text>
        <Text style={styles.price}>
          R$ {item.price.toFixed(2).replace(".", ",")}{" "}
          <Text style={styles.priceNote}>no Pix</Text>
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleRemove}
          style={styles.removeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Remover item"
        >
          <Entypo name="heart-outlined" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => onBuy?.(item.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.buyText}>COMPRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F0EFEB",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },

  // Cover
  coverWrap: {
    borderRadius: 10,
    overflow: "hidden",
    flexShrink: 0,
  },
  cover: {
    width: 64,
    height: 64,
    borderRadius: 10,
    resizeMode: "cover",
  },
  coverFallback: {
    backgroundColor: "#B39050",
    alignItems: "center",
    justifyContent: "center",
  },
  coverFallbackText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  // Info
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  meta: {
    fontSize: 12,
    color: "#666",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginTop: 4,
  },
  priceNote: {
    fontWeight: "400",
    color: "#666",
  },

  // Actions
  actions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    flexShrink: 0,
    alignSelf: "stretch",
  },
  removeBtn: {
    padding: 2,
  },
  removeIcon: {
    fontSize: 18,
  },
  buyBtn: {
    backgroundColor: "#F5A623",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  buyText: {
    color: "#412402",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
