import { Text, View} from "react-native";
import React from "react";
import Stack from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false, presentation: "card" }}>
        <Stack.Screen name="sign-in" options={{ gestureEnabled: false }} />
        <Stack.Screen name="sign-up" options={{ gestureEnabled: false }} />
      </Stack>

      <StatusBar style="light" backgroundColor="#161622" />
    </>
  );
};
export default AuthLayout;

