import { Text, View} from "react-native";
import React from "react";
import Stack from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

const ProfileLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="_profile" />
      </Stack>

      <StatusBar style="dark" backgroundColor="#161622" />
    </>
  );
};
export default ProfileLayout;

