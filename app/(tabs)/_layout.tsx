import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import AlertIcon from "@/assets/icons/AlertIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import MegaPhoneIcon from "@/assets/icons/MegaPhoneIcon";
import UserIcon from "@/assets/icons/UserIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import CustomTabBar from '@/components/CustomTabBar';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      headerShown: useClientOnlyValue(false, true),
    }}
    tabBar={props => <CustomTabBar {...props} />}
    >
    <Tabs.Screen
      name="profile"
      options={{
        title: "",
        tabBarIcon: ({ color }) => (
          <UserIcon stroke={color} width={30} height={30} />
        ),
      }}
    />
        <Tabs.Screen
          name="report"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <MegaPhoneIcon stroke={color} width={30} height={30} />
            ),
          }}
        />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <HomeIcon stroke={color} width={50} height={50} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="call"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <PhoneIcon stroke={color} width={30} height={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AlertIcon stroke={color} width={35} height={35} />
          ),
        }}
      />
    </Tabs>
  );
}
