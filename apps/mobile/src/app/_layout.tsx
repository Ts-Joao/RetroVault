import {
  ChakraPetch_400Regular,
  ChakraPetch_700Bold,
  useFonts,
} from "@expo-google-fonts/chakra-petch";
import { BarlowCondensed_400Regular } from "@expo-google-fonts/barlow-condensed";
import { SpecialElite_400Regular } from "@expo-google-fonts/special-elite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, useColorScheme, ActivityIndicator } from "react-native";
import { SplashScreen, Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";

import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import "./globals.css";
import { useAuthStore } from "../stores/useAuthStore";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync("#000000");

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Chackra: ChakraPetch_400Regular,
    "Chackra-Bold": ChakraPetch_700Bold,
    Elite: SpecialElite_400Regular,
    Barlow: BarlowCondensed_400Regular,
  });

  const colorSchema = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const initializing = useAuthStore((s) => s.initializing);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Initialize auth store once on mount
  useEffect(() => {
    initialize();
  }, []);

  // Redirect logic: if not authenticated, force /login; if authenticated and on login, go to root
  useEffect(() => {
    if (!loaded || initializing) return;

    const isAuthRoute =
      pathname?.startsWith("/login") || pathname?.startsWith("/register");

    if (!token && !isAuthRoute) {
      router.replace("/login");
    } else if (token && isAuthRoute) {
      router.replace("/");
    }
  }, [token, pathname, loaded, initializing]);

  if ((!loaded && !error) || initializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View
        style={{ flex: 1, backgroundColor: "black" }}
        className={colorSchema === "dark" ? "dark" : ""}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}
