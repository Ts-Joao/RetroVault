import { Octicons, Ionicons } from '@expo/vector-icons';
import Header from "@/components/Header";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs 
            screenOptions={{
                header: () => <Header />,
                tabBarStyle: {
                backgroundColor: '#BF372A',
                borderTopWidth: 0,
                elevation: 0,
                height: 60,
                position: 'absolute',
                bottom: insets.bottom,
            },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#fff',
            }}
            safeAreaInsets={{ bottom: 0 }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Início",
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name={focused ? 'home-fill' : 'home' } size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen name="favorites"
                options={{
                    tabBarLabel: "Favorites",
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name={focused ? 'heart-fill' : 'heart' } size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen 
                name="profile" 
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}