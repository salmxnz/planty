import React from 'react'
import { Stack } from 'expo-router'
import "../global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthProvider';
import { CartProvider } from '../context/CartProvider';
import { UserPlantsProvider } from '../context/UserPlantsProvider';
import { Provider } from 'react-redux';
import { store } from '../store/store';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded,error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Provider store={store}>
        <AuthProvider>
          <CartProvider>
            <UserPlantsProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="screens" options={{ headerShown: false }} />
                <Stack.Screen name="plant-details" options={{ headerShown: false }} />
                <Stack.Screen name="plant-details/[slug]" options={{ headerShown: false }} />
                <Stack.Screen name="features" options={{ headerShown: false }} />
                <Stack.Screen name="features/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="categories" options={{ headerShown: false }} />
                <Stack.Screen name="categories/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="search" options={{ headerShown: false }} />
                <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
                <Stack.Screen name="search/filters" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ headerShown: false }} />
                <Stack.Screen name="plant-care/[slug]" options={{ headerShown: false }} />
              </Stack>
            </UserPlantsProvider>
          </CartProvider>
        </AuthProvider>
    </Provider>
  );  
};

export default RootLayout;
