import { View, Text, Image } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { router, useFocusEffect } from "expo-router";
import { supabase } from '../../utils/supabase'
import { images } from "../../constants";
import { TouchableOpacity } from "react-native";
import { useAuth } from '@/context/AuthProvider'
import Loading from '@/components/Loading'
import { BackHandler } from 'react-native';

const SignIn = () => {
  const { session, isLoading } = useAuth();
  // Modify your SignIn component's form state:
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Instead of using a combined form object
// This prevents one field update from affecting another
  // const [form, setForm] = useState({
  //   email: '',
  //   password: ''
  // });
  const [loading, setLoading] = useState(false);

  // Use useEffect for navigation instead of redirecting during render
  useEffect(() => {
    if (session && !isLoading) {
      router.replace("/(tabs)/home");
    }
  }, [session, isLoading]);

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
        email: email,
        password: password,
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
    <SafeAreaView className="bg-primary-light dark:bg-primary-dark flex-1">
      <GestureHandlerRootView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-6">
            {/* <Image source={images.logo} className="w-[115px] h-[35px] self-center mb-8" resizeMode="contain" /> */}
            <View className="w-full max-w-md">
              <View className="items-center space-y-1 mb-8">
                <Text className="text-accent-light dark:text-accent-dark text-4xl font-psemibold mb-2">Welcome back</Text>
                <Text className="text-black dark:text-white text-base font-pregular">Log in to your account</Text>
              </View>
              <FormField 
                imageIcon="account"
                title="Email" 
                value={email}
                handleChangeText={(value) => setEmail(value)} 
                placeholder="example@gmail.com" 
                otherStyles="mb-5" 
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />
              <FormField
                imageIcon="lock"
                title="Password" 
                value={password}
                handleChangeText={(value) => setPassword(value)} 
                placeholder="Enter your password" 
                otherStyles="mb-6"
                secureTextEntry
                isPassword={true}
                forgetPassword= {true}
                textContentType="password"
                autoComplete="password"
              />
              <CustomButton 
                title={loading ? 'Loading...' : 'Login'}
                containerStyles={`bg-accent-light dark:bg-accent-dark rounded-xl min-h-[62px] justify-center items-center px-4 w-full`}
                handlePress={handleSignIn}
                textStyles="text-white dark:text-primary-dark font-psemibold text-pregular text-[18px]"
                isLoading={loading}
              />
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-500 dark:text-gray-300 font-pregular">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                  <Text className="text-accent-light dark:text-accent-dark font-psemibold">Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default SignIn;