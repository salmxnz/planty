import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { supabase } from '../../utils/supabase'
import { images } from "../../constants";
import { TouchableOpacity } from "react-native";
import { useAuth } from '@/context/AuthProvider'
import Loading from '@/components/Loading'
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';



const SignIn = () => {
  const { session, isLoading } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Use useEffect for navigation instead of redirecting during render
  // useEffect(() => {
  //   if (session && !isLoading) {
  //     router.replace("/(tabs)/home");
  //   }
  // }, [session, isLoading]);

  // If still loading auth state, show loading screen

  //handle back button press

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // Prevents back action
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
  
      return () => subscription.remove();
    }, [])
  );
  
  if (isLoading) {
    return <Loading />;
  }

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      router.replace("/(tabs)/home");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary-light dark:bg-primary-dark h-full">
      <GestureHandlerRootView>
        <ScrollView>
          <View className="w-full min-h-full px-4 my-6">
            {/* <Image source={images.logo} className="w-[115px] h-[35px]" resizeMode="contain" /> */}
            <View className="text-center items-center space-y-1 mt-32">
              <Text className="text-accent-light dark:text-accent-dark text-4xl font-psemibold mb-3">Welcome back</Text>
              <Text className="text-black dark:text-white text-base font-pregular">Log in to your account</Text>
            </View>
            <FormField 
              imageIcon="account"
              title="Email" 
              value={form.email}
              handleChangeText={(value) => setForm({ ...form, email: value })} 
              placeholder="example@gmail.com" 
              otherStyles="mt-7" 
              keyboardType="email-address"
            />
            <FormField 
              imageIcon="lock"
              title="Password" 
              value={form.password}
              handleChangeText={(value) => setForm({ ...form, password: value })} 
              placeholder="Enter your password" 
              otherStyles="mt-7"
              secureTextEntry
            />
            <View className="mt-8">
              <CustomButton 
              title="Sign In"
              containerStyles={`bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 mt-7 w-full`}
              handlePress={handleSignIn}
              textStyles="text-white dark:text-primary-dark font-psemibold text-pregular text-[18px]"
              isLoading={loading}
              />
            </View>
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-500 dark:text-gray-300 font-pregular">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                <Text className="text-accent-light dark:text-accent-dark font-psemibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default SignIn;