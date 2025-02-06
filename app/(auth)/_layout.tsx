import { Text, View} from "react-native";
import React from "react";
import Stack from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="light" backgroundColor="#161622" />
    </>
  );
};
export default AuthLayout;

