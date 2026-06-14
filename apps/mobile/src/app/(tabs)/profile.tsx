import { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Profileproduct from "../../components/Profileproduct";
import Profilewish from "../../components/Profilewish";
import Profilerating from "../../components/Profilerating";
import useAuthStore from '../../stores/useAuthStore'

const TABS = ["Pedidos", "Wishlist", "Avaliações"] as const;
type Tab = (typeof TABS)[number];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Pedidos");
  const logout = useAuthStore((s) => s.logout)
  const profile = useAuthStore((s) => s.profile)

  const handleLogout = () => {
    Alert.alert('Confirmação', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout()
          } catch (e: any) {
            Alert.alert('Erro', e.message || 'Falha ao sair')
          }
        },
      },
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Banner */}
      <View style={{ height: 120, backgroundColor: "#D1D5DB" }} />

      {/* Avatar + Info */}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: -28,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#EF4444",
            }}
          />
        </View>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 12}}
      >
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, color: "#000" }}>
            {profile?.name ?? 'Usuário'}
          </Text>
          <Text style={{ fontSize: 12, color: "#333" }}>{profile?.email ?? ''}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
          <Ionicons name="log-out-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          paddingBottom: 0,
        }}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingBottom: 8,
              borderBottomWidth: activeTab === tab ? 2 : 0,
              borderBottomColor: "#000",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontWeight: activeTab === tab ? "600" : "400",
                fontSize: 14,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F3F4F6" }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      >
        {activeTab === "Pedidos" && (
          <>
            <Profileproduct />
          </>
        )}
        {activeTab === "Wishlist" && (
          <>
            <Profilewish />
          </>
        )}
        {activeTab === "Avaliações" && (
          <>
            <Profilerating />
          </>
        )}
      </ScrollView>
    </View>
  );
}
